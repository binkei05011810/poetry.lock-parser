import React from 'react';
import { useNavigate } from 'react-router-dom';

import './PackageCard.scss';
import { CustomButton } from '../../shared/CustomButton';

interface PackageCardProps {
  name: string;
}

function PackageCard(props: PackageCardProps) {
  const { name } = props;
  const navigate = useNavigate();

  const viewPackage = () => {
    navigate(`/${name}`);
  };
  return (
    <div className="package">
      <div className="package__name">{name}</div>
      <CustomButton variant="contained" disableRipple onClick={viewPackage}>
        View package
      </CustomButton>
    </div>
  );
}

export default PackageCard;
