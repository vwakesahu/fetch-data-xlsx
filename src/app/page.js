"use client";
import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Home = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedValue, setEditedValue] = useState("");
  const [editedCell, setEditedCell] = useState({ rowIndex: 0, columnName: "" });
  const [data, setData] = useState([]);
  const [columnMappings, setColumnMappings] = useState({});
  const [mappedData, setMappedData] = useState([]);
  const [newFixedColumn, setNewFixedColumn] = useState("");
  const [fixedColumns, setFixedColumns] = useState(["First Name", "Country"]);
  const [selectedRowIndex, setSelectedRowIndex] = useState(0);

  useEffect(() => {
    // Update the mapped data whenever columnMappings or data changes
    const updatedMappedData = data.map((row) => {
      const rowData = {};
      fixedColumns.forEach((fixedColumn) => {
        rowData[fixedColumn] = row[columnMappings[fixedColumn]];
      });
      return rowData;
    });

    setMappedData(updatedMappedData);
  }, [columnMappings, data, fixedColumns]);

  useEffect(() => {
    // Load data when selectedRowIndex changes
    if (mappedData.length > 0) {
      const selectedRow = mappedData[selectedRowIndex];
      console.log("Selected Row Data:", selectedRow);
      // Perform additional actions or data loading based on the selected row
    }
  }, [selectedRowIndex, mappedData]);

  const handleCellClick = (rowIndex, columnName, value) => {
    setEditedCell({ rowIndex, columnName });
    setEditedValue(value);
    setIsEditing(true);
  };

  const handleInputBlur = () => {
    setIsEditing(false);

    // Update the data with the edited value
    if (editedCell.columnName && editedValue !== "") {
      handleInputValueChange(editedCell.rowIndex, editedCell.columnName, editedValue);
    }
  };


  const handleColumnChange = (fixedColumn, value) => {
    setColumnMappings((prevMappings) => ({
      ...prevMappings,
      [fixedColumn]: value,
    }));
  };

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

  const handleRowSelectionChange = (index) => {
    setSelectedRowIndex(index);
  };

  const handleLogOverallData = () => {
    console.log("Overall Data:", mappedData);
  };

    const handleColumnMappingChange = (fixedColumn, value) => {
    setColumnMappings((prevMappings) => ({
      ...prevMappings,
      [fixedColumn]: value,
    }));
  };

  const handleInputValueChange = (rowIndex, column, value) => {
    setMappedData((prevMappedData) => {
      const updatedData = [...prevMappedData];
      const updatedRow = { ...updatedData[rowIndex], [column]: value };
      updatedData[rowIndex] = updatedRow;
      return updatedData;
    });
  };

  return (
    <div className="h-screen w-screen py-16 px-16">
      <div className="flex items-center gap-10">
        <Input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
          className="w-auto"
        />
        <div>
          {" "}
          {data.length > 0 && (
            <div className="flex items-center justify-center gap-2">
              <Input
                type="text"
                value={newFixedColumn}
                onChange={handleNewFixedColumnChange}
              />

              <Button type="button" onClick={handleAddFixedColumn}>
                Add
              </Button>
            </div>
          )}
        </div>
      </div>

      {data.length > 0 && (
        <div>
          <h3>Map Columns:</h3>

          <form>
            <table className="table">
              <thead>
                <tr>
                  {fixedColumns.map((fixedColumn) => (
                    <th key={fixedColumn}>{fixedColumn}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {fixedColumns.map((fixedColumn) => (
                    <td key={fixedColumn}>
                      <Select
                        value={columnMappings[fixedColumn] || ""}
                        onValueChange={(value) =>
                          handleColumnChange(fixedColumn, value)
                        }
                      >
                        <SelectTrigger>
                          <span>
                            {columnMappings[fixedColumn] ||
                              "-- Select Column --"}
                          </span>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Columns</SelectLabel>
                            {Object.keys(data[0]).map((column) => (
                              <SelectItem key={column} value={column}>
                                {column}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </td>
                  ))}
                </tr>

                 {mappedData.map((row, rowIndex) => (
                <tr key={rowIndex} onClick={() => handleRowSelectionChange(rowIndex)} className={rowIndex === selectedRowIndex ? "selected-row" : ""}>
                  {fixedColumns.map((column) => (
                    <td key={column}>
                      {isEditing && editedCell.rowIndex === rowIndex && editedCell.columnName === column ? (
                        <Input
                          type="text"
                          value={editedValue}
                          onChange={(e) => setEditedValue(e.target.value)}
                          onBlur={handleInputBlur}
                          autoFocus
                        />
                      ) : (
                        <div onClick={() => handleCellClick(rowIndex, column, row[column])}>
                          {row[column]}
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
              </tbody>
            </table>
          </form>

        
            <Button type="button" onClick={handleLogOverallData}>
              Log Overall Data
            </Button>
        
        </div>
      )}
    </div>
  );
};

export default Home;
