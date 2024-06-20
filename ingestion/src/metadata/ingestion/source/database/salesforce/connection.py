#  Copyright 2021 Collate
#  Licensed under the Apache License, Version 2.0 (the "License");
#  you may not use this file except in compliance with the License.
#  You may obtain a copy of the License at
#  http://www.apache.org/licenses/LICENSE-2.0
#  Unless required by applicable law or agreed to in writing, software
#  distributed under the License is distributed on an "AS IS" BASIS,
#  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#  See the License for the specific language governing permissions and
#  limitations under the License.

"""
Source connection handler
"""
from typing import Optional

from simple_salesforce.api import Salesforce
from sqlalchemy.engine import Engine

from metadata.generated.schema.entity.automations.workflow import (
    Workflow as AutomationWorkflow,
)
from metadata.generated.schema.entity.services.connections.database.salesforceConnection import (
    SalesforceConnection,
)
from metadata.ingestion.connections.test_connections import test_connection_steps
from metadata.ingestion.ometa.ometa_api import OpenMetadata


def get_connection(connection: SalesforceConnection) -> Engine:
    """
    Create connection
    """
    return Salesforce(
        username=connection.username,
        password=connection.password.get_secret_value(),
        security_token=connection.securityToken.get_secret_value(),
        domain=connection.salesforceDomain,
        version=connection.salesforceApiVersion,
        **connection.connectionArguments.__root__
        if connection.connectionArguments
        else {},
    )


def test_connection(
    metadata: OpenMetadata,
    client: Salesforce,
    service_connection: SalesforceConnection,
    automation_workflow: Optional[AutomationWorkflow] = None,
) -> None:
    """
    Test connection. This can be executed either as part
    of a metadata workflow or during an Automation Workflow
    """
    test_fn = {"CheckAccess": client.describe}

    test_connection_steps(
        metadata=metadata,
        test_fn=test_fn,
        service_type=service_connection.type.value,
        automation_workflow=automation_workflow,
    )
