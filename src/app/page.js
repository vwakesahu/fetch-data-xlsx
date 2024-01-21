"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "@/components/ui/select";
import React, { useState } from "react";
import * as XLSX from "xlsx";

// ... (your existing imports and other code)

const Home = () => {
  const [data, setData] = useState([]);
  const [columnMappings, setColumnMappings] = useState({});
  const [mappedData, setMappedData] = useState([]);
  const [newFixedColumn, setNewFixedColumn] = useState("");
  const [fixedColumns, setFixedColumns] = useState(["First Name", "Country"]);

  const handleFileUpload = (e) => {
    const reader = new FileReader();
    reader.readAsBinaryString(e.target.files[0]);
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet);
      console.log(parsedData);
      setData(parsedData);

      // Initialize columnMappings with an empty mapping for each fixed column
      const initialMappings = {};
      fixedColumns.forEach((column) => {
        initialMappings[column] = "";
      });
      setColumnMappings(initialMappings);
    };
  };

  const handleColumnChange = (fixedColumn, e) => {
    const selectedColumn = e.target.value;
    setColumnMappings((prevMappings) => {
      const updatedMappings = {
        ...prevMappings,
        [fixedColumn]: selectedColumn,
      };
      console.log(`Selected column for ${fixedColumn}: ${selectedColumn}`);
      console.log("Updated Column Mappings:", updatedMappings);
      return updatedMappings;
    });
  };

  const handleSave = () => {
    if (Object.values(columnMappings).some((value) => value === "")) {
      console.error("Not all columns are mapped!");
      return;
    }
    console.log("Saved Column Mappings:", columnMappings);

    // Generate the mapped data based on the column mappings
    const mappedData = data.map((row, rowIndex) => {
      const rowData = {};
      fixedColumns.forEach((fixedColumn) => {
        const mappedColumn = columnMappings[fixedColumn];
        const cellValue = row[mappedColumn];
        rowData[fixedColumn] = cellValue;
        console.log(
          `Mapping: [Row ${rowIndex}, ${fixedColumn}] => [${mappedColumn}: ${cellValue}]`
        );
      });
      return rowData;
    });

    setMappedData(mappedData);

    // Log the overall mapped data to the console
    console.log("Overall Mapped Data:", mappedData);
  };

  const handleNewFixedColumnChange = (e) => {
    setNewFixedColumn(e.target.value);
  };

  const handleAddFixedColumn = () => {
    setFixedColumns((prevColumns) => [...prevColumns, newFixedColumn]);
    setColumnMappings((prevMappings) => ({
      ...prevMappings,
      [newFixedColumn]: "",
    }));
    setNewFixedColumn("");
  };

  return (
    <div className="h-screen w-screen py-16 px-16">
      <Input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />

      {data.length > 0 && (
        <div>
          <h3>Map Columns:</h3>

          <form>
            {fixedColumns.map((fixedColumn) => (
              <div key={fixedColumn}>
                <label>{fixedColumn}:</label>
                <Select
                  
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="-- Select Column --" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup >
                      <SelectLabel>First Name</SelectLabel>
                      {Object.keys(data[0]).map((column) => (
                        <SelectItem key={column} value={column} >
                          {column}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>

                {/* <select
                  onChange={(e) => handleColumnChange(fixedColumn, e)}
                  value={columnMappings[fixedColumn] || ""}
                >
                  <option value="">-- Select Column --</option>
                  {Object.keys(data[0]).map((column) => (
                    <option key={column} value={column}>
                      {column}
                    </option>
                  ))}
                </select> */}
              </div>
            ))}

            <div>
              <label>Add Fixed Column:</label>
              <Input
                type="text"
                value={newFixedColumn}
                onChange={handleNewFixedColumnChange}
              />
              <button type="button" onClick={handleAddFixedColumn}>
                Add
              </button>
            </div>
          </form>

          <button onClick={handleSave}>Save Mapping</button>

          {mappedData.length > 0 && (
            <div>
              <h3>Overall Mapped Data:</h3>
              <table className="table">
                <thead>
                  <tr>
                    {fixedColumns.map((column) => (
                      <th key={column}>{column}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {mappedData.map((row, index) => (
                    <tr key={index}>
                      {fixedColumns.map((column) => (
                        <td key={column}>{row[column]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
