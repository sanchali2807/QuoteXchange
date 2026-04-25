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
[ ] Submit Bid
[ ] List Bids
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