/* global describe beforeAll afterAll test expect  */
'use strict'
require('dotenv').config()

const database = require('../../services/database')
const mysql = require('mysql')
const keys = require('../../config/keys')

const insertTestCourses = `
  REPLACE INTO sections (course_id, section, title, term, instructor, inst_type, registered, cap, credits)
  VALUES ('TST-1003', 1, 'Test Course One', 'A6', 'T. Ester', 'F', 25, 100, 3),
         ('TST-1003', 2, 'Test Course One', 'B6', 'T. Ester', 'F', 25, 100, 3),
         ('TST-1024', 1, 'Test Course Two', 'B6', 'T. Ester', 'F', 15, 45, 4),
         ('TST-4032', 1, 'Test Course Three', 'C6', 'T. Ester', 'F', 10, 75, 2)
`
const deleteTestCourses = `
  DELETE FROM sections
  WHERE course_id LIKE 'TST%'
`

function initMockCourses () {
  let testConnection = mysql.createConnection(keys.database)
  return new Promise((resolve, reject) => {
    testConnection.connect((err) => {
      if (err) return reject(err)
      testConnection.query(insertTestCourses, (err, results, fields) => {
        if (err) return reject(err)
        return resolve(results)
      })
      testConnection.end()
    })
  })
}

function clearMockCourses () {
  let testConnection = mysql.createConnection(keys.database)
  return new Promise((resolve, reject) => {
    testConnection.connect(err => {
      if (err) return reject(err)
      testConnection.query(deleteTestCourses, (err, results, fields) => {
        if (err) return reject(err)
        return resolve(results)
      })
      testConnection.end()
    })
  })
}

describe('Database', () => {
  beforeAll(() => {
    return initMockCourses()
  })

  afterAll(() => {
    return clearMockCourses()
  })

  test('should be able to connect to the database', async () => {
    let result = await database.checkHealth()
    expect(result.msg).toBe(`Connection to database is successful`)
  })

  describe('getCourse', () => {
    test('should return a course when given a valid and existing course ID and section', async () => {
      let result = await database.getCourse('TST-1003', '2')
      // console.log(result)
      expect(result[0].course_id).toBe('TST-1003')
    })

    // test('should return an empty set when given a valid but non-existing course ID and section', async () => {
    //   let result = await database.getCourse('TST-1234', '1')
    // })

    // test('should return an empty set when no courses exist in the database', async () => {
    //   let result = await database.getCourse('TST-1234', '1')
    // })

    // test('should throw an error when given an invalid course ID and section', async () => {
    //   let result = await database.getCourse('INVALID', 'INVALID')
    // })
  })

  // describe('getAllSectionsOfCourse', () => {
  //   test('should return all sections of a course when given just a valid course ID', async () => {
  //     let result = await database.getAllSectionsOfCourse('TST-1003')
  //     expect()
  //   })

  //   test('should return an empty set when given a valid but non-existing course ID', async () => {
  //     let result = await database.getAllSectionsOfCourse('TST-1234')
  //   })

  //   test('should return an empty set when no courses exist in the database', async () => {
  //     let result = await database.getCourse('TST-1234', '1')
  //   })

  //   test('should throw an error when given an invalid course ID', async () => {
  //     let result = await database.getCourse('1234')
  //   })
  // })

  // test('should return all courses', async () => {
  //   let result = await database.getAllCourses()
  //   expect()
  // })
})
