import React, { useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';

import { Package } from '../../models/package';
import { updatePackageMap, updatePackageList, updateCurrentFile } from '../../redux/slices/packageSlice';
import { RootState, AppDispatch } from '../../redux/store';
import PackageCard from '../package-card/PackageCard';
import { InputFile } from '../../assets/InputFile';
import { ErrorFile } from '../../assets/ErrorFile';
import { CustomButton } from '../../shared/CustomButton';
import { CustomIconButton } from '../../shared/CustomIconButton';
import CloseIcon from '../../assets/close.png';
import './PackageList.scss';

const SvgWrapper = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    width: '70%',
  },
  [theme.breakpoints.up('lg')]: {
    width: '50%',
  },
}));

const EMPTY_INPUT_ERROR = 'Upload a poetry.lock file to get packages data';
const PARSE_FILE_ERROR = 'Error parsing file. This tool only support valid poetry.lock file. Make sure you upload the right format.';

function PackageList() {
  const [errorMessage, setErrorMessage] = useState<string>(EMPTY_INPUT_ERROR);
  /* A reference to the hidden file input element */
  const fileInput = useRef(null);
  const packageList = useSelector((state: RootState) => state.packageManager.packageList);
  const currentFile = useSelector((state: RootState) => state.packageManager.currentFile);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (currentFile) {
      setErrorMessage(packageList && packageList.length > 0 ? '' : PARSE_FILE_ERROR);
    }
  }, []);

  /* Click to trigger the click event on the hidden input element */
  const handleClick = () => {
    (fileInput.current as any).click();
  };

  /**
   * extractKeyValue
   * * Extract [key, value] pair from a line, i.e. name = "atomicwrites" -> ['name', 'atomicwrites']
   * @param line: Information line, i.e. name = "atomicwrites"
   */
  const extractKeyValue = (line: string) => {
    /* Everything before the first '=' */
    const key = line.slice(0, line.indexOf('=')).trim().toLowerCase();
    /* Everything after the first '=' */
    const value = line.slice(line.indexOf('=') + 1).trim();
    return [key, value];
  };

  /**
   * extractPackageDetail
   * * Extract the information from a package string
   * @param packageAsString: package information as string
   * @return packageObj: A package object
   */
  const extractPackageDetail = (packageAsString: string) => {
    const packageObj: any = {};
    /* Split to get a list of information lines */
    const infos = packageAsString.split('\n');
    if (infos.length <= 0) {
      return null;
    }
    /* Loop through each info line to get key value pair, i.e name = "atomicwrites" */
    infos.forEach(info => {
      if (info) {
        const [key, value] = extractKeyValue(info);
        packageObj[key] = JSON.parse(value);
      }
    });
    return packageObj;
  };

  /**
   * extractPackageExtras
   * * Populate the packageObj with dependencies
   * @param packages: object with key as package name and value as package details
   * @param packageBlock: a string contains data of a package
   */
  const extractFullPackage = (packages: any, packageBlock: string) => {
    /* Split to get all the sections in a package block:
        - package information
        - package.dependencies
        - package.extras */
    const sections = packageBlock.split('\n\n');
    if (sections.length <= 0) return null;

    /* Extract package information */
    const packageObj: Package = extractPackageDetail(sections[0]);

    let requiredDependencies: string[] = [];
    let optionalDependencies: string[] = [];

    for (let i = 1; i < sections.length; i++) {
      const section = sections[i];
      if (section.includes('[package.dependencies]')) {
        /* Get the part after "[package.dependencies]" and split to get an array of lines */
        const dependencies = section.split('[package.dependencies]');
        const infos = dependencies.length > 1 ? dependencies[1].split('\n') : [];

        if (infos.length <= 0) continue;

        /* Loop through each info line to get key value pair, i.e name = "atomicwrites" */
        for (let info of infos) {
          if (!info) continue;

          const [key, value] = extractKeyValue(info);
          /* Check if the dependencies is optional or not */
          const optional = value.includes('optional = true');
          if (optional) {
            if (!optionalDependencies.includes(key)) {
              optionalDependencies.push(key);
            }
          } else {
            requiredDependencies.push(key);
            /* packageObj has dependency [key] --> Reverse dependency of key is packageObj */
            if (packages[key]) {
              /*  If the package with name [key] already has reverseDependencies array, we will push the packageObj name to reverseDependencies */
              packages[key].reverseDependencies = packages[key].reverseDependencies
                ? [...packages[key].reverseDependencies, packageObj.name]
                : [packageObj.name];
            } else {
              /* If the package with name [key] do not have any reverseDependencies yet, we will initiate a new array and add packageObj name as the first element */
              packages[key] = {};
              packages[key].reverseDependencies = [packageObj.name];
            }
          }
        }
      } else if (section.includes('[package.extras]')) {
        /* Get the part after "[package.extras]" and split to get an array of lines */
        const extras = section.split('[package.extras]');
        const infos = extras.length > 1 ? extras[1].split('\n') : [];

        if (infos.length <= 0) continue;

        /* Loop through each info line to get key value pair, i.e name = "atomicwrites" */
        for (let info of infos) {
          if (!info) continue;

          const [key, value] = extractKeyValue(info);
          /* Parse to get the list of dependencies --> remove the version part, i.e. "coverage[toml] (>=5.0.2)" --> "coverage[toml]"*/
          const dependencies = JSON.parse(value).map((val: string) => val.split(' ')[0].toLowerCase());
          optionalDependencies = [...optionalDependencies, ...dependencies.filter((dep: string) => !optionalDependencies.includes(dep))];
        }
      }
    }

    packageObj.requiredDependencies = requiredDependencies;
    packageObj.optionalDependencies = optionalDependencies;
    packages[packageObj.name] = packages[packageObj.name] ? { ...packages[packageObj.name], ...packageObj } : packageObj;
    return packageObj;
  };

  /**
   * parseFile
   * * Parse the result from the FileReader
   * @param fileAsString
   */
  const parseFile = (fileAsString: string) => {
    /* Split fileAsString into an array with element as data of each package */
    const packageBlocks = fileAsString.split('[[package]]');
    const packages = {};
    const packagesArray: string[] = [];

    for (let packageBlock of packageBlocks) {
      if (packageBlock) {
        const packageObj = extractFullPackage(packages, packageBlock);
        if (packageObj && packageObj.name) {
          packagesArray.push(packageObj.name);
        }
      }
    }

    dispatch(updatePackageMap(packages));
    dispatch(updatePackageList(packagesArray));
  };

  const uploadFile = (event: any) => {
    /* Get the user input file */
    const file = event.target.files[0];
    dispatch(updateCurrentFile(file.name));
    /* Use FileReader to read the content of the file as string */
    const fileReader = new FileReader();
    fileReader.onload = () => {
      try {
        parseFile((fileReader as any).result);
        setErrorMessage('');
      } catch (e) {
        setErrorMessage(PARSE_FILE_ERROR);
        dispatch(updatePackageMap({}));
        dispatch(updatePackageList([]));
        console.log('error: ', e);
      }
    };

    fileReader.readAsText(file);
  };

  const getPageContent = () => {
    return errorMessage ? (
      <div className="error-message-wrapper">
        <p>{errorMessage}</p>
        <SvgWrapper>{errorMessage === EMPTY_INPUT_ERROR ? <InputFile /> : <ErrorFile />}</SvgWrapper>
      </div>
    ) : (
      <Grid container spacing={2}>
        {packageList.map((packageName: string) => (
          <Grid item xs={6} md={4} key={packageName}>
            <PackageCard name={packageName} />
          </Grid>
        ))}
      </Grid>
    );
  };

  const clearFile = () => {
    dispatch(updatePackageMap({}));
    dispatch(updatePackageList([]));
    dispatch(updateCurrentFile(''));
    setErrorMessage(EMPTY_INPUT_ERROR);
  };

  return (
    <div className="package-list-root">
      <div>
        <CustomButton onClick={handleClick}>Upload file</CustomButton>
        {currentFile && (
          <>
            <span className="file-name">{currentFile}</span>
            <CustomIconButton onClick={clearFile}>
              <img src={CloseIcon} alt="Close sidebar" width="20" />
            </CustomIconButton>
          </>
        )}
      </div>
      <input type="file" ref={fileInput} style={{ display: 'none' }} onChange={uploadFile} />
      <div className="package-list-wrapper">{getPageContent()}</div>
    </div>
  );
}

export default PackageList;
