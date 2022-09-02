/*
 *  Copyright 2021 Collate
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

import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Space, Typography } from 'antd';
import classNames from 'classnames';
import { lowerCase } from 'lodash';
import React, {
  FunctionComponent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { Link } from 'react-router-dom';
import { NoDataFoundPlaceHolder } from '../../constants/services.const';
import { TableData } from '../../generated/entity/data/table';
import { withLoader } from '../../hoc/withLoader';
import { isEven } from '../../utils/CommonUtils';
import { RowData } from './RowData';

export interface SampleColumns {
  name: string;
  dataType: string;
}

interface Props {
  sampleData?: {
    columns?: Array<SampleColumns>;
    rows?: TableData['rows'];
  };
}

const SampleDataTable: FunctionComponent<Props> = ({ sampleData }: Props) => {
  const { Paragraph } = Typography;
  const tableRef = useRef<HTMLDivElement>(null);
  const [scrollOffset, setScrollOffSet] = useState<number>(0);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [scrollHandle, setScrollHandle] = useState<{
    left: boolean;
    right: boolean;
  }>({ left: true, right: true });

  const scrollHandler = (scrollOffset: number) => {
    if (tableRef.current) {
      tableRef.current.scrollLeft += scrollOffset;
      setScrollOffSet(tableRef.current.scrollLeft);
    }
  };

  useLayoutEffect(() => {
    setContainerWidth(
      (tableRef.current?.scrollWidth ?? 0) -
        (tableRef.current?.clientWidth ?? 0)
    );
  }, []);

  useEffect(() => {
    const rFlag = scrollOffset !== containerWidth;
    const lFlag = scrollOffset > 0;
    setScrollHandle((pre) => ({ ...pre, right: rFlag, left: lFlag }));
  }, [scrollOffset, containerWidth]);

  return (
    <div
      className="tw-relative tw-flex tw-justify-between"
      data-testid="sample-data"
      onScrollCapture={() => {
        setScrollOffSet(tableRef.current?.scrollLeft ?? 0);
      }}>
      {scrollHandle.left ? (
        <button
          className="tw-border tw-border-main tw-fixed tw-left-7 tw-top-2/3 tw-rounded-full tw-shadow-md tw-z-50 tw-bg-body-main tw-w-8 tw-h-8"
          onClick={() => scrollHandler(-50)}>
          <FontAwesomeIcon
            className="tw-text-grey-muted"
            icon={faChevronLeft}
          />
        </button>
      ) : null}
      {scrollHandle.right ? (
        <button
          className="tw-border tw-border-main tw-fixed tw-right-7 tw-top-2/3 tw-rounded-full tw-shadow-md tw-z-50 tw-bg-body-main tw-w-8 tw-h-8"
          onClick={() => scrollHandler(50)}>
          <FontAwesomeIcon
            className="tw-text-grey-muted"
            icon={faChevronRight}
          />
        </button>
      ) : null}

      <div
        className="tw-table-responsive tw-overflow-x-auto tw-table-container"
        ref={tableRef}>
        {sampleData?.rows?.length && sampleData?.columns?.length ? (
          <table
            className="tw-min-w-max tw-w-full tw-table-auto"
            data-testid="sample-data-table">
            <thead>
              <tr className="tableHead-row">
                {sampleData.columns.map((column) => {
                  return (
                    <th
                      className="tableHead-cell"
                      data-testid="column-name"
                      key={column.name}>
                      <Space direction="vertical" size={0}>
                        <span>{column.name}</span>
                        <span className="tw-text-grey-muted">
                          ({lowerCase(column.dataType)})
                        </span>
                      </Space>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="tw-text-gray-600 tw-text-sm">
              {sampleData?.rows?.map((row, rowIndex) => {
                return (
                  <tr
                    className={classNames(
                      'tableBody-row',
                      !isEven(rowIndex + 1) ? 'odd-row' : null
                    )}
                    data-testid="row"
                    key={rowIndex}>
                    {row.map((data, index) => {
                      return (
                        <td
                          className="tableBody-cell"
                          data-testid="cell"
                          key={index}>
                          <RowData data={data} />
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="tw-flex tw-flex-col tw-justify-center tw-font-medium tw-items-center tw-border tw-border-main tw-rounded-md tw-p-8">
            <div className="tw-mt-12">
              <img alt="No Service" src={NoDataFoundPlaceHolder} width={120} />
            </div>
            <div className="tw-mt-8 tw-max-w-x tw-text-center">
              <Paragraph style={{ marginBottom: '4px' }}>
                {' '}
                No sample data available
              </Paragraph>
              <Paragraph>
                {' '}
                To view Sample Data, run the Profiler Ingestion. Please refer to
                this doc to schedule the{' '}
                <Link
                  className="tw-ml-1"
                  target="_blank"
                  to={{
                    pathname:
                      'https://docs.open-metadata.org/openmetadata/ingestion/workflows/profiler',
                  }}>
                  Profiler Ingestion
                </Link>
              </Paragraph>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default withLoader<Props>(SampleDataTable);
