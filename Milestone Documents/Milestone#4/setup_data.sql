
-- Create tables

-- ORGANIZER Table
CREATE TABLE ORGANIZER (
  OrganizerID INTEGER PRIMARY KEY,
  OrganizerName VARCHAR(255),
  OrganizerEmail VARCHAR(255) NOT NULL,
  OrganizerPhoneNo CHAR(10),
  UNIQUE (OrganizerName, OrganizerPhoneNo)
);

-- EVENT Table
CREATE TABLE EVENT (
  EventID INTEGER PRIMARY KEY,
  OrganizerID INTEGER NOT NULL,
  EventDate DATE,
  Expense INTEGER,
  EventTime CHAR(5),
  EventName VARCHAR(255) NOT NULL,
  FOREIGN KEY (OrganizerID) REFERENCES ORGANIZER(OrganizerID) ON DELETE CASCADE
);

-- TEAM_MEMBER Table
CREATE TABLE TEAM_MEMBER (
  MemberName VARCHAR(255),
  MemberPhoneNo CHAR(10),
  OrganizerID INTEGER,
  StaffEmail VARCHAR(255),
  PayRate INTEGER,
  PRIMARY KEY (MemberName, MemberPhoneNo),
  FOREIGN KEY (OrganizerID) REFERENCES ORGANIZER(OrganizerID) ON DELETE CASCADE
);

-- SPEAKER Table
CREATE TABLE SPEAKER (
  MemberName VARCHAR(255),
  MemberPhoneNo CHAR(10),
  ExperienceLevel VARCHAR(255),
  PRIMARY KEY (MemberName, MemberPhoneNo),
  FOREIGN KEY (MemberName, MemberPhoneNo) REFERENCES TEAM_MEMBER(MemberName, MemberPhoneNo) ON DELETE CASCADE
);

-- PHOTOGRAPHER Table
CREATE TABLE PHOTOGRAPHER (
  MemberName VARCHAR(255),
  MemberPhoneNo CHAR(10),
  Equipment VARCHAR(255),
  PRIMARY KEY (MemberName, MemberPhoneNo),
  FOREIGN KEY (MemberName, MemberPhoneNo) REFERENCES TEAM_MEMBER(MemberName, MemberPhoneNo) ON DELETE CASCADE
);

-- VOLUNTEER Table
CREATE TABLE VOLUNTEER (
  MemberName VARCHAR(255),
  MemberPhoneNo CHAR(10),
  Skill VARCHAR(255),
  PRIMARY KEY (MemberName, MemberPhoneNo),
  FOREIGN KEY (MemberName, MemberPhoneNo) REFERENCES TEAM_MEMBER(MemberName, MemberPhoneNo) ON DELETE CASCADE
);

-- SPONSOR Table
CREATE TABLE SPONSOR (
  SponsorName VARCHAR(255),
  SponsorPhoneNo CHAR(10),
  SponsorEmail VARCHAR(255),
  PRIMARY KEY (SponsorName, SponsorPhoneNo)
);

-- SPONSOR_SUPPORT Table
CREATE TABLE SPONSOR_SUPPORT (
  EventID INTEGER,
  SponsorName VARCHAR(255),
  SponsorPhoneNo CHAR(10),
  SponsorshipType VARCHAR(255),
  EstimatedValue INTEGER,
  PRIMARY KEY (EventID, SponsorName, SponsorshipType),
  FOREIGN KEY (EventID) REFERENCES EVENT(EventID) ON DELETE CASCADE,
  FOREIGN KEY (SponsorName, SponsorPhoneNo) REFERENCES SPONSOR(SponsorName, SponsorPhoneNo) ON DELETE CASCADE
);

-- FEEDBACK Table
CREATE TABLE FEEDBACK (
  FeedbackID INTEGER PRIMARY KEY,
  EventID INTEGER,
  Rating INTEGER,
  Feedback VARCHAR(255),
  FOREIGN KEY (EventID) REFERENCES EVENT(EventID) ON DELETE CASCADE
);

-- EVENT_PHOTO Table
CREATE TABLE EVENT_PHOTO (
  PhotoID INTEGER PRIMARY KEY,
  EventID INTEGER,
  Description VARCHAR(255),
  FOREIGN KEY (EventID) REFERENCES EVENT(EventID) ON DELETE CASCADE
);

-- PARTICIPANT Table
CREATE TABLE PARTICIPANT (
  ParticipantID INTEGER PRIMARY KEY,
  ParticipantName VARCHAR(255),
  ParticipantEmail VARCHAR(255),
  UNIQUE (ParticipantName, ParticipantEmail)
);

-- ATTENDANCE Table
CREATE TABLE ATTENDANCE (
  EventID INTEGER,
  ParticipantID INTEGER,
  PRIMARY KEY (EventID, ParticipantID),
  FOREIGN KEY (EventID) REFERENCES EVENT(EventID) ON DELETE CASCADE,
  FOREIGN KEY (ParticipantID) REFERENCES PARTICIPANT(ParticipantID) ON DELETE CASCADE
);

-- LOCATION Table
CREATE TABLE LOCATION (
  Address VARCHAR(255) PRIMARY KEY,
  Capacity INTEGER
);

-- EVENT_AND_LOCATION Table
CREATE TABLE EVENT_AND_LOCATION (
  EventID INTEGER,
  Address VARCHAR(255),
  EventDate DATE,
  Expense INTEGER,
  EventTime CHAR(5),
  EventName VARCHAR(255) NOT NULL,
  PRIMARY KEY (EventID),
  FOREIGN KEY (EventID) REFERENCES EVENT(EventID) ON DELETE CASCADE,
  FOREIGN KEY (Address) REFERENCES LOCATION(Address) ON DELETE CASCADE
);



-- Insert data into tables
INSERT INTO ORGANIZER VALUES (1, 'UBC Science', 'contact@ubcscience.ca', '6041234567');
INSERT INTO ORGANIZER VALUES (2, 'UBC Tech Club', 'techclub@ubc.ca', '6041234568');
INSERT INTO ORGANIZER VALUES (3, 'IKB', 'ikb@ubc.ca', '6041234569');

INSERT INTO EVENT VALUES (101, 1, TO_DATE('2023-12-15', 'YYYY-MM-DD'), 5000, '18:00', 'Tech Expo 2023');
INSERT INTO EVENT VALUES (102, 1, TO_DATE('2023-10-07', 'YYYY-MM-DD'), 3000, '09:00', 'DevFest');
INSERT INTO EVENT VALUES (103, 2, TO_DATE('2023-11-22', 'YYYY-MM-DD'), 4000, '12:00', 'Literature Festival');
INSERT INTO EVENT VALUES (104, 2, TO_DATE('2023-09-05', 'YYYY-MM-DD'), 2000, '10:00', 'Robotics Workshop');
INSERT INTO EVENT VALUES (105, 3, TO_DATE('2023-08-20', 'YYYY-MM-DD'), 3500, '14:00', 'Art History Exhibition');
INSERT INTO EVENT VALUES (106, 3, TO_DATE('2023-07-11', 'YYYY-MM-DD'), 2500, '16:00', 'Historical Archives Tour');

INSERT INTO TEAM_MEMBER VALUES ('John Doe', '7781234567', 1, 'johndoe@ubc.ca', 30);
INSERT INTO TEAM_MEMBER VALUES ('Emily Smith', '7781234568', 1, 'emilysmith@ubc.ca', 35);
INSERT INTO TEAM_MEMBER VALUES ('Alex Johnson', '7781234569', 2, 'alexjohnson@ubc.ca', 40);

INSERT INTO SPEAKER VALUES ('John Doe', '7781234567', 'Expert');

INSERT INTO PHOTOGRAPHER VALUES ('Alex Johnson', '7781234569', 'Sony A7 III');

INSERT INTO VOLUNTEER VALUES ('Emily Smith', '7781234568', 'First Aid');

INSERT INTO SPONSOR VALUES ('Google', '8001234567', 'sponsor@google.com');
INSERT INTO SPONSOR VALUES ('Amazon', '8001234568', 'sponsor@amazon.com');
INSERT INTO SPONSOR VALUES ('Microsoft', '8001234569', 'sponsor@microsoft.com');
INSERT INTO SPONSOR VALUES ('Adobe', '8001234570', 'sponsor@adobe.com');
INSERT INTO SPONSOR VALUES ('Intel', '8001234571', 'sponsor@intel.com');
INSERT INTO SPONSOR VALUES ('Tesla', '8001234572', 'sponsor@tesla.com');

INSERT INTO SPONSOR_SUPPORT VALUES (101, 'Google', '8001234567', 'Financial', 10000);
INSERT INTO SPONSOR_SUPPORT VALUES (102, 'Google', '8001234567', 'In-Kind', 12000);
INSERT INTO SPONSOR_SUPPORT VALUES (103, 'Google', '8001234567', 'Media', 15000);
INSERT INTO SPONSOR_SUPPORT VALUES (104, 'Google', '8001234567', 'Technical', 11000);
INSERT INTO SPONSOR_SUPPORT VALUES (105, 'Amazon', '8001234568', 'Financial', 16000);
INSERT INTO SPONSOR_SUPPORT VALUES (102, 'Microsoft', '8001234569', 'In-Kind', 20000);
INSERT INTO SPONSOR_SUPPORT VALUES (102, 'Microsoft', '8001234569', 'Financial', 20000);
INSERT INTO SPONSOR_SUPPORT VALUES (102, 'Microsoft', '8001234569', 'Technical', 20000);
INSERT INTO SPONSOR_SUPPORT VALUES (102, 'Microsoft', '8001234569', 'Media', 20000);
INSERT INTO SPONSOR_SUPPORT VALUES (102, 'Adobe', '8001234570', 'Media', 14000);
INSERT INTO SPONSOR_SUPPORT VALUES (101, 'Intel', '8001234571', 'Technical', 17000);


INSERT INTO FEEDBACK VALUES (1004, 104, 5, 'Outstanding workshop with hands-on experience.');
INSERT INTO FEEDBACK VALUES (1005, 105, 4, 'Very informative and well-presented exhibition.');
INSERT INTO FEEDBACK VALUES (1006, 106, 5, 'Incredible tour, rich in history and detail.');
INSERT INTO FEEDBACK VALUES (1007, 101, 4, 'Impressive tech displays and networking opportunities.');
INSERT INTO FEEDBACK VALUES (1008, 102, 4, 'Well-organized event with great speakers.');
INSERT INTO FEEDBACK VALUES (1009, 103, 2, 'Interesting topics, but the sessions were too long.');
INSERT INTO FEEDBACK VALUES (1010, 104, 3, 'Robotics concepts were great, but needed more practical examples.');
INSERT INTO FEEDBACK VALUES (1011, 105, 5, 'Fantastic curation of art pieces and knowledgeable guides.');
INSERT INTO FEEDBACK VALUES (1012, 106, 3, 'Enjoyable tour, but it felt a bit rushed.');

INSERT INTO EVENT_PHOTO VALUES (2001, 101, 'Opening Ceremony Photo');


INSERT INTO PARTICIPANT VALUES (501, 'Howard', 'howards@ubc.ca');
INSERT INTO PARTICIPANT VALUES (502, 'Jerry', 'jerryc@ubc.ca');


INSERT INTO ATTENDANCE VALUES (101, 501);
INSERT INTO ATTENDANCE VALUES (101, 502);


INSERT INTO LOCATION VALUES ('UBC Robson Square, 800 Robson St', 300);
INSERT INTO LOCATION VALUES ('UBC Life Sciences Centre, 2350 Health Sciences Mall', 500);
INSERT INTO LOCATION VALUES ('UBC Nest, 6133 University Blvd', 200);


INSERT INTO EVENT_AND_LOCATION VALUES (101, 'UBC Robson Square, 800 Robson St', TO_DATE('2023-12-15', 'YYYY-MM-DD'), 5000, '18:00', 'Tech Expo 2023');
INSERT INTO EVENT_AND_LOCATION VALUES (102, 'UBC Life Sciences Centre, 2350 Health Sciences Mall', TO_DATE('2023-10-07', 'YYYY-MM-DD'), 3000, '09:00', 'DevFest');
INSERT INTO EVENT_AND_LOCATION VALUES (103, 'UBC Nest, 6133 University Blvd', TO_DATE('2023-11-22', 'YYYY-MM-DD'), 4000, '12:00', 'Literature Festival');
INSERT INTO EVENT_AND_LOCATION VALUES (104, 'UBC Robson Square, 800 Robson St', TO_DATE('2023-09-05', 'YYYY-MM-DD'), 2000, '10:00', 'Robotics Workshop');

