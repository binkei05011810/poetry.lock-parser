import React from 'react';
import { List, ListItem } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { RootState } from '../../redux/store';
import './PackageDetail.scss';
import { CustomButton } from '../../shared/CustomButton';

const CustomLink = styled(Link)(({ theme }) => ({
  color: '#B9FBC0',
  textDecoration: 'none',
  marginBottom: '8px',

  '&:hover': {
    textDecoration: 'underline',
    opacity: '0.8',
  },
}));

const InfoListItem = styled(List)(({ theme }) => ({
  marginBottom: '20px',
}));

function PackageDetail() {
  const { name } = useParams();
  const navigate = useNavigate();
  const packageMap = useSelector((store: RootState) => store.packageManager.packageMap);
  const packageDetail = packageMap[name as string];
  const sections = [
    { title: 'Name', key: 'name', isText: true },
    { title: 'Description', key: 'description', isText: true },
    { title: 'Required dependencies', key: 'requiredDependencies', isText: false },
    { title: 'Optional dependencies', key: 'optionalDependencies', isText: false },
    { title: 'Reverse dependencies', key: 'reverseDependencies', isText: false },
  ];

  if (!packageDetail) {
    return <Navigate to="/" />;
  }

  const viewAllPackages = () => {
    navigate('/');
  };

  return (
    <div className="package-detail">
      <div className="package-detail__card">
        <List>
          {sections.map(
            (section: any) =>
              (section.isText || (!section.isText && packageDetail[section.key] && packageDetail[section.key].length > 0)) && (
                <InfoListItem key={section.key} disablePadding>
                  <div className="package-detail__card__info">
                    <span className="package-detail__card__info__key">{section.title}: </span>
                    {section.isText ? (
                      <span>{packageDetail[section.key]}</span>
                    ) : (
                      <List>
                        {packageDetail[section.key].map((packageName: string) => (
                          <ListItem key={packageName} disablePadding>
                            {packageMap[packageName] ? (
                              <CustomLink to={`/${packageName}`}>{packageName}</CustomLink>
                            ) : (
                              <span>{packageName}</span>
                            )}
                          </ListItem>
                        ))}
                      </List>
                    )}
                  </div>
                </InfoListItem>
              )
          )}
        </List>
      </div>
      <div className="actions-wrapper">
        <CustomButton onClick={viewAllPackages}>View all packages</CustomButton>
      </div>
    </div>
  );
}

export default PackageDetail;
