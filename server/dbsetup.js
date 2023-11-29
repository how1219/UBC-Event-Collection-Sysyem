const oracledb = require('oracledb');
const loadEnvFile = require('../utils/envUtil');

async function setupDatabase() {
  try {
    const envVariables = loadEnvFile('./.env');
    const dbConfig = {
      user: envVariables.ORACLE_USER,
      password: envVariables.ORACLE_PASS,
      connectString: `${envVariables.ORACLE_HOST}:${envVariables.ORACLE_PORT}/${envVariables.ORACLE_DBNAME}`
    };

    let connection = await oracledb.getConnection(dbConfig);
    console.log('Connected to the Oracle database.');
    await connection.execute(`BEGIN
                                EXECUTE IMMEDIATE 'DROP TABLE EVENT_AND_LOCATION';
                                EXECUTE IMMEDIATE 'DROP TABLE LOCATION';
                                EXECUTE IMMEDIATE 'DROP TABLE ATTENDANCE';
                                EXECUTE IMMEDIATE 'DROP TABLE PARTICIPANT';
                                EXECUTE IMMEDIATE 'DROP TABLE EVENT_PHOTO';
                                EXECUTE IMMEDIATE 'DROP TABLE FEEDBACK';
                                EXECUTE IMMEDIATE 'DROP TABLE SPONSOR_SUPPORT';
                                EXECUTE IMMEDIATE 'DROP TABLE SPONSOR';
                                EXECUTE IMMEDIATE 'DROP TABLE VOLUNTEER';
                                EXECUTE IMMEDIATE 'DROP TABLE PHOTOGRAPHER';
                                EXECUTE IMMEDIATE 'DROP TABLE SPEAKER';
                                EXECUTE IMMEDIATE 'DROP TABLE TEAM_MEMBER';
                                EXECUTE IMMEDIATE 'DROP TABLE EVENT';
                                EXECUTE IMMEDIATE 'DROP TABLE ORGANIZER';
                              EXCEPTION
                                WHEN OTHERS THEN
                                  IF SQLCODE != -942 THEN
                                    RAISE;
                                  END IF;
                              END;`);
    console.log('Dropped existing tables.');

    // Define tables and their creation queries
const tablesToCreate = [
      {
        tableName: 'ORGANIZER',
        createQuery: `CREATE TABLE ORGANIZER (
          OrganizerID INTEGER PRIMARY KEY,
          OrganizerName VARCHAR(255),
          OrganizerEmail VARCHAR(255) NOT NULL,
          OrganizerPhoneNo CHAR(10),
          UNIQUE (OrganizerName, OrganizerPhoneNo)
        )`
      },
      {
        tableName: 'EVENT',
        createQuery: `CREATE TABLE EVENT (
            EventID INTEGER PRIMARY KEY,
            OrganizerID INTEGER NOT NULL,
            EventDate DATE,
            Expense INTEGER,
            EventTime CHAR(5),
            EventName VARCHAR(255) NOT NULL,
            FOREIGN KEY (OrganizerID) REFERENCES ORGANIZER(OrganizerID)
        )`
      },
      {
        tableName: 'TEAM_MEMBER',
        createQuery: `CREATE TABLE TEAM_MEMBER (
            MemberName VARCHAR(255),
            MemberPhoneNo CHAR(10),
            OrganizerID INTEGER,
            StaffEmail VARCHAR(255),
            PayRate INTEGER,
            PRIMARY KEY (MemberName, MemberPhoneNo),
            FOREIGN KEY (OrganizerID) REFERENCES ORGANIZER (OrganizerID)
        )`
      },
      {
        tableName: 'SPEAKER',
        createQuery: `CREATE TABLE SPEAKER (
            MemberName VARCHAR(255),
            MemberPhoneNo CHAR(10),
            ExperienceLevel VARCHAR(255),
            PRIMARY KEY (MemberName, MemberPhoneNo),
            FOREIGN KEY (MemberName, MemberPhoneNo) REFERENCES TEAM_MEMBER(MemberName, MemberPhoneNo)
        )`
      },
      {
        tableName: 'PHOTOGRAPHER',
        createQuery: `CREATE TABLE PHOTOGRAPHER (
            MemberName VARCHAR(255),
            MemberPhoneNo CHAR(10),
            Equipment VARCHAR(255),
            PRIMARY KEY (MemberName, MemberPhoneNo),
            FOREIGN KEY (MemberName, MemberPhoneNo) REFERENCES TEAM_MEMBER(MemberName, MemberPhoneNo)
        )`
      },
      {
        tableName: 'VOLUNTEER',
        createQuery: `CREATE TABLE VOLUNTEER (
            MemberName VARCHAR(255),
            MemberPhoneNo CHAR(10),
            Skill VARCHAR(255),
            PRIMARY KEY (MemberName, MemberPhoneNo),
            FOREIGN KEY (MemberName, MemberPhoneNo) REFERENCES TEAM_MEMBER(MemberName, MemberPhoneNo)
        )`
      },
      {
        tableName: 'SPONSOR',
        createQuery: `CREATE TABLE SPONSOR (
             SponsorName VARCHAR(255),
             SponsorPhoneNo CHAR(10),
             SponsorEmail VARCHAR(255),
             PRIMARY KEY (SponsorName, SponsorPhoneNo)
        )`
      },
      {
        tableName: 'SPONSOR_SUPPORT',
        createQuery: `CREATE TABLE SPONSOR_SUPPORT (
              EventID INTEGER,
              SponsorName VARCHAR(255),
              SponsorPhoneNo CHAR(10),
              SponsorshipType VARCHAR(255),
              EstimatedValue INTEGER,
              PRIMARY KEY (EventID, SponsorName, SponsorshipType),
              FOREIGN KEY (EventID) REFERENCES EVENT(EventID),
              FOREIGN KEY (SponsorName, SponsorPhoneNo) REFERENCES SPONSOR(SponsorName, SponsorPhoneNo)
        )`
      },
      {
        tableName: 'FEEDBACK',
        createQuery: `CREATE TABLE FEEDBACK (
               FeedbackID INTEGER PRIMARY KEY,
               EventID INTEGER,
               Rating INTEGER,
               Feedback VARCHAR(255),
               FOREIGN KEY (EventID) REFERENCES EVENT(EventID)
        )`
      },
      {
        tableName: 'EVENT_PHOTO',
        createQuery: `CREATE TABLE EVENT_PHOTO (
               PhotoID INTEGER PRIMARY KEY,
               EventID INTEGER,
               Description VARCHAR(255),
               FOREIGN KEY (EventID) REFERENCES EVENT(EventID)
        )`
      },
      {
        tableName: 'PARTICIPANT',
        createQuery: `CREATE TABLE PARTICIPANT (
                ParticipantID INTEGER PRIMARY KEY,
                ParticipantName VARCHAR(255),
                ParticipantEmail VARCHAR(255),
                UNIQUE (ParticipantName, ParticipantEmail)
        )`
      },
      {
        tableName: 'ATTENDANCE',
        createQuery: `CREATE TABLE ATTENDANCE (
                EventID INTEGER,
                ParticipantID INTEGER,
                PRIMARY KEY (EventID, ParticipantID),
                FOREIGN KEY (EventID) REFERENCES EVENT(EventID),
                FOREIGN KEY (ParticipantID) REFERENCES PARTICIPANT(ParticipantID)
        )`
      },
      {
        tableName: 'LOCATION',
        createQuery: `CREATE TABLE LOCATION (
                Address VARCHAR(255) PRIMARY KEY,
                Capacity INTEGER
        )`
      },
      {
        tableName: 'EVENT_AND_LOCATION',
        createQuery: `CREATE TABLE EVENT_AND_LOCATION (
                EventID INTEGER,
                Address VARCHAR(255),
                EventDate DATE,
                Expense INTEGER,
                EventTime CHAR(5),
                EventName VARCHAR(255) NOT NULL,
                PRIMARY KEY (EventID),
                FOREIGN KEY (EventID) REFERENCES EVENT(EventID),
                FOREIGN KEY (Address) REFERENCES LOCATION(Address)
        )`
      }
    ];

    for (const table of tablesToCreate) {
      await connection.execute(table.createQuery);
      console.log(`${table.tableName} table created successfully`);
    }

    // Insert sample data into each table

    // Sample data for ORGANIZER table
    await connection.execute(`INSERT INTO ORGANIZER VALUES (1, 'UBC Science', 'contact@ubcscience.ca', '6041234567')`);
    await connection.execute(`INSERT INTO ORGANIZER VALUES (2, 'UBC Tech Club', 'techclub@ubc.ca', '6041234568')`);
    await connection.execute(`INSERT INTO ORGANIZER VALUES (3, 'IKB', 'ikb@ubc.ca', '6041234569')`);

    // Sample data for EVENT table
    await connection.execute(`INSERT INTO EVENT VALUES (101, 1, TO_DATE('2023-12-15', 'YYYY-MM-DD'), 5000, '18:00', 'Tech Expo 2023')`);
    await connection.execute(`INSERT INTO EVENT VALUES (102, 1, TO_DATE('2023-10-07', 'YYYY-MM-DD'), 3000, '09:00', 'DevFest')`);
    await connection.execute(`INSERT INTO EVENT VALUES (103, 2, TO_DATE('2023-11-22', 'YYYY-MM-DD'), 4000, '12:00', 'Literature Festival')`);
    await connection.execute(`INSERT INTO EVENT VALUES (104, 2, TO_DATE('2023-09-05', 'YYYY-MM-DD'), 2000, '10:00', 'Robotics Workshop')`);
    await connection.execute(`INSERT INTO EVENT VALUES (105, 3, TO_DATE('2023-08-20', 'YYYY-MM-DD'), 3500, '14:00', 'Art History Exhibition')`);
    await connection.execute(`INSERT INTO EVENT VALUES (106, 3, TO_DATE('2023-07-11', 'YYYY-MM-DD'), 2500, '16:00', 'Historical Archives Tour')`);

     // Sample data for TEAM_MEMBER table
    await connection.execute(`INSERT INTO TEAM_MEMBER VALUES ('John Doe', '7781234567', 1, 'johndoe@ubc.ca', 30)`);
    await connection.execute(`INSERT INTO TEAM_MEMBER VALUES ('Emily Smith', '7781234568', 1, 'emilysmith@ubc.ca', 35)`);
    await connection.execute(`INSERT INTO TEAM_MEMBER VALUES ('Alex Johnson', '7781234569', 2, 'alexjohnson@ubc.ca', 40)`);

     // Sample data for SPEAKER table
    await connection.execute(`INSERT INTO SPEAKER VALUES ('John Doe', '7781234567', 'Expert')`);

     // Sample data for PHOTOGRAPHER table
    await connection.execute(`INSERT INTO PHOTOGRAPHER VALUES ('Alex Johnson', '7781234569', 'Sony A7 III')`);

    // Sample data for VOLUNTEER table
    await connection.execute(`INSERT INTO VOLUNTEER VALUES ('Emily Smith', '7781234568', 'First Aid')`);

    // Sample data for SPONSOR table
    await connection.execute(`INSERT INTO SPONSOR VALUES ('Google', '8001234567', 'sponsor@google.com')`);
    await connection.execute(`INSERT INTO SPONSOR VALUES ('Amazon', '8001234568', 'sponsor@amazon.com')`);
    await connection.execute(`INSERT INTO SPONSOR VALUES ('Microsoft', '8001234569', 'sponsor@microsoft.com')`);
    await connection.execute(`INSERT INTO SPONSOR VALUES ('Adobe', '8001234570', 'sponsor@adobe.com')`);
    await connection.execute(`INSERT INTO SPONSOR VALUES ('Intel', '8001234571', 'sponsor@intel.com')`);
    await connection.execute(`INSERT INTO SPONSOR VALUES ('Tesla', '8001234572', 'sponsor@tesla.com')`);

    // Sample data for SPONSOR_SUPPORT table
    await connection.execute(`INSERT INTO SPONSOR_SUPPORT VALUES (101, 'Google', '8001234567', 'Financial', 10000)`);
    await connection.execute(`INSERT INTO SPONSOR_SUPPORT VALUES (102, 'Google', '8001234567', 'In-Kind', 12000)`);
    await connection.execute(`INSERT INTO SPONSOR_SUPPORT VALUES (103, 'Google', '8001234567', 'Media', 15000)`);
    await connection.execute(`INSERT INTO SPONSOR_SUPPORT VALUES (104, 'Google', '8001234567', 'Technical', 11000)`);
    await connection.execute(`INSERT INTO SPONSOR_SUPPORT VALUES (105, 'Amazon', '8001234568', 'Financial', 16000)`);
    await connection.execute(`INSERT INTO SPONSOR_SUPPORT VALUES (102, 'Microsoft', '8001234569', 'In-Kind', 20000)`);
    await connection.execute(`INSERT INTO SPONSOR_SUPPORT VALUES (102, 'Adobe', '8001234570', 'Media', 14000)`);
    await connection.execute(`INSERT INTO SPONSOR_SUPPORT VALUES (101, 'Intel', '8001234571', 'Technical', 17000)`);

    // Sample data for FEEDBACK table
    await connection.execute(`INSERT INTO FEEDBACK VALUES (1004, 104, 5, 'Outstanding workshop with hands-on experience.')`);
    await connection.execute(`INSERT INTO FEEDBACK VALUES (1005, 105, 4, 'Very informative and well-presented exhibition.')`);
    await connection.execute(`INSERT INTO FEEDBACK VALUES (1006, 106, 5, 'Incredible tour, rich in history and detail.')`);
    await connection.execute(`INSERT INTO FEEDBACK VALUES (1007, 101, 4, 'Impressive tech displays and networking opportunities.')`);
    await connection.execute(`INSERT INTO FEEDBACK VALUES (1008, 102, 4, 'Well-organized event with great speakers.')`);
    await connection.execute(`INSERT INTO FEEDBACK VALUES (1009, 103, 2, 'Interesting topics, but the sessions were too long.')`);
    await connection.execute(`INSERT INTO FEEDBACK VALUES (1010, 104, 3, 'Robotics concepts were great, but needed more practical examples.')`);
    await connection.execute(`INSERT INTO FEEDBACK VALUES (1011, 105, 5, 'Fantastic curation of art pieces and knowledgeable guides.')`);
    await connection.execute(`INSERT INTO FEEDBACK VALUES (1012, 106, 3, 'Enjoyable tour, but it felt a bit rushed.')`);

    // Sample data for EVENT_PHOTO table
    await connection.execute(`INSERT INTO EVENT_PHOTO VALUES (2001, 101, 'Opening Ceremony Photo')`);

    // Sample data for PARTICIPANT table
    await connection.execute(`INSERT INTO PARTICIPANT VALUES (501, 'Howard', 'howards@ubc.ca')`);
    await connection.execute(`INSERT INTO PARTICIPANT VALUES (502, 'Jerry', 'jerryc@ubc.ca')`);

    // Sample data for ATTENDANCE table
    await connection.execute(`INSERT INTO ATTENDANCE VALUES (101, 501)`);
    await connection.execute(`INSERT INTO ATTENDANCE VALUES (101, 502)`);

    // Sample data for LOCATION table
    await connection.execute(`INSERT INTO LOCATION VALUES ('UBC Robson Square, 800 Robson St', 300)`);
    await connection.execute(`INSERT INTO LOCATION VALUES ('UBC Life Sciences Centre, 2350 Health Sciences Mall', 500)`);
    await connection.execute(`INSERT INTO LOCATION VALUES ('UBC Nest, 6133 University Blvd', 200)`);

    // Sample data for EVENT_AND_LOCATION table
    await connection.execute(`INSERT INTO EVENT_AND_LOCATION VALUES (101, 'UBC Robson Square, 800 Robson St', TO_DATE('2023-12-15', 'YYYY-MM-DD'), 5000, '18:00', 'Tech Expo 2023')`);
    await connection.execute(`INSERT INTO EVENT_AND_LOCATION VALUES (102, 'UBC Life Sciences Centre, 2350 Health Sciences Mall', TO_DATE('2023-10-07', 'YYYY-MM-DD'), 3000, '09:00', 'DevFest')`);
    await connection.execute(`INSERT INTO EVENT_AND_LOCATION VALUES (103, 'UBC Nest, 6133 University Blvd', TO_DATE('2023-11-22', 'YYYY-MM-DD'), 4000, '12:00', 'Literature Festival')`);
    await connection.execute(`INSERT INTO EVENT_AND_LOCATION VALUES (104, 'UBC Robson Square, 800 Robson St', TO_DATE('2023-09-05', 'YYYY-MM-DD'), 2000, '10:00', 'Robotics Workshop')`);


    // Commit the transaction
    await connection.commit();

    await connection.close();
    console.log('Database setup with sample data completed.');
  } catch (error) {
    console.error('Error setting up the database:', error);
    await connection.rollback();
    process.exit(1);
  }
}

module.exports = setupDatabase;
