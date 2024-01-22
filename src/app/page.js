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
  const [fixedColumns, setFixedColumns] = useState([
    "First Name",
    "Country",
    "Date of Birth",
    "Grade",
    "Email",
    "Password",
    "Address",
    "Stop Name",
  ]);
  const [selectedRowIndex, setSelectedRowIndex] = useState(0);

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
      const updatedValue = convertValueToColumnType(
        editedValue,
        editedCell.columnName
      );
      handleInputValueChange(
        editedCell.rowIndex,
        editedCell.columnName,
        updatedValue
      );
    }
  };

  const convertValueToColumnType = (value, column) => {
    switch (column) {
      case "Grade":
        return isNaN(value) ? value : parseFloat(value);
      // Add other cases for additional columns
      default:
        return value;
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

  const handleAddFixedColumn = () => {
    setFixedColumns((prevColumns) => [...prevColumns, newFixedColumn]);
    setColumnMappings((prevMappings) => ({
      ...prevMappings,
      [newFixedColumn]: "",
    }));
    setNewFixedColumn("");
  };

  const isValidDate = (dateString) => {
    if (!dateString) {
      return false;
    }
    if (typeof dateString === "number") return false;

    const [day, month, year] = dateString.split("/");
    const date = new Date(`${year}-${month}-${day}`);
    return !isNaN(date.getTime());
  };

  const validateCellType = (value, column) => {
    switch (column) {
      case "First Name":
      case "Country":
      case "Password":
      case "Address":
      case "Stop Name":
        return typeof value === "string" ? "ok" : "error";
      case "Date of Birth":
        return isValidDate(value) ? "ok" : "error";
      case "Grade":
        return typeof value === "number" ? "ok" : "error";
      case "Date of Birth":
        return isValidDate(value) ? "ok" : "error";
      case "Email":
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value) ? "ok" : "error";
      // Add other cases for additional columns
      default:
        return "ok";
    }
  };

  const handleLogOverallData = () => {
    console.log("Overall Data:", mappedData);
  };

  const handleInputValueChange = (rowIndex, column, value) => {
    setMappedData((prevMappedData) => {
      const updatedData = [...prevMappedData];
      const updatedRow = { ...updatedData[rowIndex], [column]: value };

      // Check the type validity of the value
      const typeValidity = validateCellType(value, column);

      // Update the row with typeValidity information
      updatedRow.isValidType = typeValidity === "ok";
      updatedRow.typeValidationError = typeValidity === "error";

      updatedData[rowIndex] = updatedRow;
      return updatedData;
    });
  };

  useEffect(() => {
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

  // const handleCellClick = (rowIndex, columnName, value) => {
  //   setEditedCell({ rowIndex, columnName });
  //   setEditedValue(value);
  //   setIsEditing(true);
  // };

  // const handleInputBlur = () => {
  //   setIsEditing(false);

  //   // Update the data with the edited value
  //   if (editedCell.columnName && editedValue !== "") {
  //     handleInputValueChange(
  //       editedCell.rowIndex,
  //       editedCell.columnName,
  //       editedValue
  //     );
  //   }
  // };

  // const handleColumnChange = (fixedColumn, value) => {
  //   setColumnMappings((prevMappings) => ({
  //     ...prevMappings,
  //     [fixedColumn]: value,
  //   }));
  // };

  // const handleFileUpload = (e) => {
  //   const reader = new FileReader();
  //   reader.readAsBinaryString(e.target.files[0]);
  //   reader.onload = (e) => {
  //     const data = e.target.result;
  //     const workbook = XLSX.read(data, { type: "binary" });
  //     const sheetName = workbook.SheetNames[0];
  //     const sheet = workbook.Sheets[sheetName];
  //     const parsedData = XLSX.utils.sheet_to_json(sheet);
  //     console.log(parsedData);
  //     setData(parsedData);

  //     // Initialize columnMappings with an empty mapping for each fixed column
  //     const initialMappings = {};
  //     fixedColumns.forEach((column) => {
  //       initialMappings[column] = "";
  //     });
  //     setColumnMappings(initialMappings);
  //   };
  // };

  const handleNewFixedColumnChange = (e) => {
    setNewFixedColumn(e.target.value);
  };

  // const handleAddFixedColumn = () => {
  //   setFixedColumns((prevColumns) => [...prevColumns, newFixedColumn]);
  //   setColumnMappings((prevMappings) => ({
  //     ...prevMappings,
  //     [newFixedColumn]: "",
  //   }));
  //   setNewFixedColumn("");
  // };

  const handleRowSelectionChange = (index) => {
    setSelectedRowIndex(index);
  };

  // const handleLogOverallData = () => {
  //   console.log("Overall Data:", mappedData);
  // };

  const handleColumnMappingChange = (fixedColumn, value) => {
    setColumnMappings((prevMappings) => ({
      ...prevMappings,
      [fixedColumn]: value,
    }));
  };

  // const handleInputValueChange = (rowIndex, column, value) => {
  //   setMappedData((prevMappedData) => {
  //     const updatedData = [...prevMappedData];
  //     const updatedRow = { ...updatedData[rowIndex], [column]: value };
  //     updatedData[rowIndex] = updatedRow;
  //     return updatedData;
  //   });
  // };

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
                onChange={(e) => setNewFixedColumn(e.target.value)}
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
                          handleColumnMappingChange(fixedColumn, value)
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
                  <tr
                    key={rowIndex}
                    className={
                      rowIndex === selectedRowIndex ? "selected-row" : ""
                    }
                  >
                    {fixedColumns.map((column) => (
                      <td
                        key={column}
                        style={{
                          backgroundColor:
                            validateCellType(row[column], column) === "error"
                              ? "red"
                              : "white",
                        }}
                      >
                        {isEditing &&
                        editedCell.rowIndex === rowIndex &&
                        editedCell.columnName === column ? (
                          <Input
                            type="text"
                            value={editedValue}
                            onChange={(e) => setEditedValue(e.target.value)}
                            onBlur={handleInputBlur}
                            autoFocus
                            style={{
                              backgroundColor:
                                validateCellType(editedValue, column) ===
                                "error"
                                  ? "red"
                                  : "white",
                            }}
                          />
                        ) : (
                          <div
                            onClick={() =>
                              handleCellClick(rowIndex, column, row[column])
                            }
                          >
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
