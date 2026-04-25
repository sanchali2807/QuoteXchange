cd server
npm init -y install package.json
npm install express sequelize mysql2 dotenv jsonwebtoken bcryptjs cors pdfkit
npm install -D nodemon



AUTH APIs
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
RFQ APIs
POST   /api/rfqs
GET    /api/rfqs
GET    /api/rfqs/:id
PUT    /api/rfqs/:id
DELETE /api/rfqs/:id
(put/delete optional but recommended)
BID APIs
POST /api/rfqs/:id/bids
GET  /api/rfqs/:id/bids
LOG APIs
GET /api/rfqs/:id/logs
EXPORT
GET /api/rfqs/:id/export.pdf
LIVE UPDATES
GET /api/rfqs/:id/live
If we build these now → backend complete.
STEP 3 — Database Schema (Final)
Users
id
name
email UNIQUE
password
role ENUM(buyer,supplier)
companyName
createdAt
updatedAt
RFQs
id
name
referenceId
buyerId FK users
startTime
closeTime
forcedCloseTime
pickupDate
xMinutes
yMinutes
triggerType ENUM(ANY,BID_LAST_X,RANK_CHANGE,L1_CHANGE)
status ENUM(Active,Closed,ForceClosed)
createdAt
updatedAt
Bids
id
rfqId FK
supplierId FK
freight
origin
destination
transitTime
validity
totalPrice
rank
createdAt
updatedAt
ActivityLogs
id
rfqId FK
type
message
meta JSON
createdAt




Register
✅ email valid
✅ password min 6
✅ role buyer/supplier only
RFQ Create
✅ name required
✅ start < close
✅ close < forcedClose
✅ xMinutes > 0
✅ yMinutes > 0
Bid Submit
✅ only supplier
✅ auction active
✅ all numeric charges valid
✅ no negative values
Auction Rules
✅ cannot extend after forced close
✅ cannot bid after close
✅ ranking recalculated each bid




server/
│── config/
│    db.js
│
│── models/
│    User.js
│    RFQ.js
│    Bid.js
│    ActivityLog.js
│    index.js
│
│── middleware/
│    authMiddleware.js
│    roleMiddleware.js
│
│── routes/
│    authRoutes.js
│    rfqRoutes.js
│    bidRoutes.js
│
│── controllers/
│    authController.js
│    rfqController.js
│    bidController.js
│
│── services/
│    auctionService.js
│
│── utils/
│    token.js
│
│── server.js
│── .env






[ done ] Register
[ done ] Login
[ done ] Me
[ done ] Create RFQ
[ done ] List RFQs
[ done ] RFQ Detail
[ done ] Update RFQ
[ done ] Delete RFQ
[ done ] Submit Bid
[ done ] List Bids
[ ] Logs
[ ] Export PDF
[ ] SSE Live
[ ] Extension Logic
[ ] Validation
[ ] Error Handling


{
  "email":"san@gmail.com",
  "password":"&Year122"
}

{
  "email": "supplier1@gmail.com",
  "password": "&Year111"
}

{
   "email": "supplier2@gmail.com",
  "password": "&Year222"
}

{
  "email": "supplier3@gmail.com",
  "password": "&Year333"
}

The getLeaderboard() flow starts by fetching all bids for a specific RFQ using rfqId, along with supplier details from the User table. These bids are first ordered by supplierId ascending and createdAt descending so that each supplier’s newest bid appears first. Then the code loops through the bids and uses a Map to keep only the first bid of each supplier, which effectively means only their latest bid is retained while older bids are ignored. After that, the latest bids of all suppliers are converted into an array and sorted by totalPrice from lowest to highest, because the cheapest bid should rank first in a reverse auction. Finally, ranks like 1, 2, 3 are assigned based on sorted position and the completed leaderboard is returned in the API response.




//buyer
bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IlNhbmNoYWxpIiwiZW1haWwiOiJzYW5AZ21haWwuY29tIiwicm9sZSI6ImJ1eWVyIiwiaWF0IjoxNzc3MTIzNTg3LCJleHAiOjE3Nzc3MjgzODd9.QfDnWhXuQXKHkEi1N0OzKzTjrcdcI33VN7yGcOM8o_0


//supplier 1
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwibmFtZSI6IlJhaHVsIFN1cHBsaWVyIiwiZW1haWwiOiJzdXBwbGllcjFAZ21haWwuY29tIiwicm9sZSI6InN1cHBsaWVyIiwiaWF0IjoxNzc3MTM0MjY3LCJleHAiOjE3Nzc3MzkwNjd9.bkhCE9KkGRca8ubjKkvEPRNdLNvdUIIANnRuKfqjrw8


eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywibmFtZSI6Ik5laGEgU3VwcGxpZXIiLCJlbWFpbCI6InN1cHBsaWVyMkBnbWFpbC5jb20iLCJyb2xlIjoic3VwcGxpZXIiLCJpYXQiOjE3NzcxMzQyOTQsImV4cCI6MTc3NzczOTA5NH0.EwI8FTB-7UbINab21cOwrbnpra24Uv-5hMa0aRXyu1o

eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwibmFtZSI6IkFtaXQgU3VwcGxpZXIiLCJlbWFpbCI6InN1cHBsaWVyM0BnbWFpbC5jb20iLCJyb2xlIjoic3VwcGxpZXIiLCJpYXQiOjE3NzcxMzQzMjQsImV4cCI6MTc3NzczOTEyNH0._Ry3G17JomNK0ANIX3fneEVsvxbZ_vIPaPiY5-lySzw