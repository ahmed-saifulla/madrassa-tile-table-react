import React, { useState, useEffect } from 'react';

import './App.css';

function App() {
  const [testcols, setTestcols] = useState(['Day', 'Montg', 'Year']);
  const [cols, setCols] = useState([]);
  const [rows, setRows] = useState([]);
  const [classes, setClasses] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    let SHEET_ID = '1cYBL-8HTymg53opj6Y5T2_UIIC4ELlHUCvMz4TzPF9E'
    let SHEET_TITLE = 'Sheet1';
    let SHEET_RANGE = 'A1:E81'
    let FULL_URL = ('https://docs.google.com/spreadsheets/d/' + SHEET_ID + '/gviz/tq?sheet=' + SHEET_TITLE + '&range=' + SHEET_RANGE);

    fetch(FULL_URL)
      .then(res => res.text())
      .then(rep => {
        let data = JSON.parse(rep.substr(47).slice(0, -2));

        console.log({ data });
        
        let colsArray = data.table.cols.map(item => item.label)
        let rowsArray = data.table.rows.map((item, index) => {
          return {
            day: (index % 2 == 0) ? item?.c[0]?.v : '',
            class: ((index % 2 == 0) ? item?.c[1]?.v : data.table.rows[index - 1]?.c[1]?.v),
            period1: item?.c[2]?.v,
            period2: item?.c[3]?.v,
          }
        })
        let classesArray = data.table.rows.map((item, index) => {
          return ((index % 2 == 0) ? item?.c[1]?.v : data.table.rows[index - 1]?.c[1]?.v)
        })
        setCols(colsArray)  
        setRows(rowsArray)
        setClasses([...new Set(classesArray)])




      }).catch((err) => {
        console.log('errrr', err);
      })
  }, []); // The empty dependency array means this effect will only run once (on mount)

  useEffect(() => {
    console.log({ rows });
    console.log({ cols });
    console.log({ classes });
  }, [rows, cols])

  const [selectedClass, setSelectedClass] = useState('');

  const handleChange = (event) => {
    setSelectedClass(event.target.value);
    let filteredDataArray = rows.filter(item => item.class == event.target.value)
    setFilteredData(filteredDataArray);

  };

  const findKey = (item) => {
    switch (item) {
      case 'Day':
        return 'day'
      case 'Period 1':
        return 'period1'
      case 'Period 2':
        return 'period2'
      case 'Grade':
        return 'grade'

      default:
        return ''
    }
  }


  return (
    <div className="App">
      <div>
        <label htmlFor="dynamicDropdown">Select an option:</label>
        <select id="dynamicDropdown" value={selectedClass} onChange={handleChange}>
          {classes.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
        <p>Selected value: {selectedClass}</p>
      </div>

      <div>
        <table>
          <thead>
            <tr>
              {cols ? cols.map(item =>
                <>
                  <th>{item}</th>
                </>
              ) : null}
            </tr>
          </thead>

          <tbody>
            {filteredData && filteredData.map(rowItem =>
              <tr>
                {cols ? cols.map((item, index) =>
                  <td>{rowItem[findKey(item)]}</td>
                ) : null}
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
