const express = require('express');
const router = express.Router();

/* API routes */
router.use('/baseInfo', require('./baseInfoRoutes'));
router.use('/user', require('./userRoutes'));
router.use('/permission', require('./permissionRoutes'));

router.use('/request', require('./requestRoutes'));
router.use('/requestInquiry', require('./request_InquiryRoutes'));
router.use('/technical_committee_meeting', require('./tcMeetingRoutes'));
router.use('/technical_committee', require('./technical_committeeRoutes'));
router.use('/report', require('./reportRoutes'));

 router.use('/approvals', require('./approvalsRoutes'));
 router.use('/proposal', require('./proposalRoutes'));
 router.use('/contract_draft', require('./contract_draftRoutes'));
 router.use('/contract', require('./contractRoutes'));
 router.use('/invoice', require('./invoiceRoutes'));
 router.use('/invoice_inquiry', require('./invoice_InquiryRoutes'));
 router.use('/invoice_back_company', require('./invoice_back_companyRoutes'));
 router.use('/invoice_send_company', require('./invoice_send_companyRoutes'));
 router.use('/invoice_logistics', require('./invoice_logisticsRoutes'));
 router.use('/invoice_payment', require('./invoice_paymentRoutes'));
module.exports = router;
