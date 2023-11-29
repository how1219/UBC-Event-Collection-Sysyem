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
      const checkTableQuery = `SELECT count(*) FROM user_tables WHERE table_name = '${table.tableName}'`;
      const result = await connection.execute(checkTableQuery);
      const count = result.rows[0][0];

      if (count === 0) {
        await connection.execute(table.createQuery);
        console.log(`${table.tableName} table created successfully`);
      } else {
        console.log(`${table.tableName} table already exists`);
      }
    }

    await connection.close();
    console.log('Database setup completed.');
  } catch (error) {
    console.error('Error setting up the database:', error);
    process.exit(1);
  }
}

module.exports = setupDatabase;
