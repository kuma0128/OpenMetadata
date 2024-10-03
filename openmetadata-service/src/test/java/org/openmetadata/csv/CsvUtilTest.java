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

package org.openmetadata.csv;

import static org.junit.jupiter.api.Assertions.assertEqual;
import static org.openmetadata.common.utils.CommonUtil.listOf;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.openmetadata.schema.entity.type.CustomProperty;
import org.openmetadata.schema.type.EntityReference;
import org.openmetadata.schema.type.TagLabel;

public class CsvUtilTest {
  @Test
  void testAddRecord() {
    List<String> expectedRecord = new ArrayList<>();
    List<String> actualRecord = new ArrayList<>();

    // Add string
    expectedRecord.add(null);
    assertEqual(expectedRecord, CsvUtil.addField(actualRecord, (String) null));

    expectedRecord.add("abc");
    assertEqual(expectedRecord, CsvUtil.addField(actualRecord, "abc"));

    // Add list of strings
    expectedRecord.add("");
    assertEqual(expectedRecord, CsvUtil.addFieldList(actualRecord, null));

    expectedRecord.add("def;ghi");
    assertEqual(expectedRecord, CsvUtil.addFieldList(actualRecord, listOf("def", "ghi")));

    // Add entity reference
    expectedRecord.add(null);
    assertEqual(
        expectedRecord, CsvUtil.addEntityReference(actualRecord, null)); // Null entity reference

    expectedRecord.add("fqn");
    assertEqual(
        expectedRecord,
        CsvUtil.addEntityReference(
            actualRecord, new EntityReference().withFullyQualifiedName("fqn")));

    // Add entity references
    expectedRecord.add(null);
    assertEqual(
        expectedRecord, CsvUtil.addEntityReferences(actualRecord, null)); // Null entity references

    expectedRecord.add("fqn1;fqn2");
    List<EntityReference> refs =
        listOf(
            new EntityReference().withFullyQualifiedName("fqn1"),
            new EntityReference().withFullyQualifiedName("fqn2"));
    assertEqual(expectedRecord, CsvUtil.addEntityReferences(actualRecord, refs));

    // Add tag labels
    expectedRecord.add(null);
    assertEqual(
        expectedRecord, CsvUtil.addTagLabels(actualRecord, null)); // Null entity references

    expectedRecord.add("t1;t2");
    List<TagLabel> tags = listOf(new TagLabel().withTagFQN("t1"), new TagLabel().withTagFQN("t2"));
    assertEqual(expectedRecord, CsvUtil.addTagLabels(actualRecord, tags));

    // Add extension
    expectedRecord.add(null);
    assertEqual(expectedRecord, CsvUtil.addExtension(actualRecord, null)); // Null extension

    ObjectMapper mapper = new ObjectMapper();
    ObjectNode jsonNode = mapper.createObjectNode();

    // Add new custom property stringCp of type string
    CustomProperty stringCp =
        new CustomProperty()
            .withName("stringCp")
            .withDescription("string type custom property")
            .withPropertyType(
                new EntityReference().withFullyQualifiedName("string").withType("type"));
    JsonNode stringCpValue =
        mapper.convertValue("String; input; with; semicolon\n And new line", JsonNode.class);
    jsonNode.set("stringCp", stringCpValue);

    // Add new custom property queryCp of type sqlQuery
    JsonNode queryCpValue =
        mapper.convertValue("SELECT * FROM table WHERE column = 'value';", JsonNode.class);
    jsonNode.set("queryCp", queryCpValue);

    expectedRecord.add(
        "\"stringCp:String; input; with; semicolon\n And new line\";\"queryCp:SELECT * FROM table WHERE column = 'value';\"");
    assertEqual(expectedRecord, CsvUtil.addExtension(actualRecord, jsonNode));
  }

  public static void assertCsv(String expectedCsv, String actualCsv) {
    // Break a csv text into records, sort it and compare
    List<String> expectedCsvRecords = listOf(expectedCsv.split(CsvUtil.LINE_SEPARATOR));
    List<String> actualCsvRecords = listOf(actualCsv.split(CsvUtil.LINE_SEPARATOR));
    assertEqual(
        expectedCsvRecords.size(),
        actualCsvRecords.size(),
        "Expected " + expectedCsv + " actual " + actualCsv);
    Collections.sort(expectedCsvRecords);
    Collections.sort(actualCsvRecords);
    for (int i = 0; i < expectedCsvRecords.size(); i++) {
      assertEqual(expectedCsvRecords.get(i), actualCsvRecords.get(i));
    }
  }
}
