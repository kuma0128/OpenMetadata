/*
 *  Copyright 2022 Collate.
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *  http://www.apache.org/licenses/LICENSE-2.0
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { ROUTES } from '../../constants/constants';
import { ERROR_PLACEHOLDER_TYPE } from '../../enums/common.enum';
import { useAuth } from '../../hooks/authHooks';
import ErrorPlaceHolder from '../common/ErrorWithPlaceholder/ErrorPlaceHolder';

interface AdminProtectedRouteProps {
  hasPermission?: boolean;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({
  hasPermission,
}) => {
  const { isAdminUser } = useAuth();
  const hasPermissionFlag = Boolean(hasPermission);

  if (isAdminUser || hasPermissionFlag) {
    return <Outlet />;
  } else if (!hasPermissionFlag) {
    return <ErrorPlaceHolder type={ERROR_PLACEHOLDER_TYPE.PERMISSION} />;
  } else {
    return <Navigate to={ROUTES.SIGNIN} />;
  }
};

export default AdminProtectedRoute;
