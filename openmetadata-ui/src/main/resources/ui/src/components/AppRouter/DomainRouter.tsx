/*
 *  Copyright 2024 Collate.
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
import React, { useMemo } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ROUTES_RELATIVE } from '../../constants/constants';
import { usePermissionProvider } from '../../context/PermissionProvider/PermissionProvider';
import { ResourceEntity } from '../../context/PermissionProvider/PermissionProvider.interface';
import { userPermissions } from '../../utils/PermissionsUtils';
import AddDomain from '../Domain/AddDomain/AddDomain.component';
import DomainPage from '../Domain/DomainPage.component';
import AdminProtectedRoute from './AdminProtectedRoute';

const DomainRouter = () => {
  const { permissions } = usePermissionProvider();
  const domainPermission = useMemo(
    () =>
      userPermissions.hasViewPermissions(ResourceEntity.DOMAIN, permissions),
    [permissions]
  );

  return (
    <Routes>
      <Route element={<AddDomain />} path={ROUTES_RELATIVE.ADD_DOMAIN} />
      <Route element={<AdminProtectedRoute hasPermission={domainPermission} />}>
        <Route element={<DomainPage />} path="/" />
        <Route element={<DomainPage />} path={ROUTES_RELATIVE.DOMAIN_DETAILS} />
        <Route
          element={<DomainPage />}
          path={ROUTES_RELATIVE.DOMAIN_DETAILS_WITH_TAB}
        />
      </Route>
    </Routes>
  );
};

export default DomainRouter;
