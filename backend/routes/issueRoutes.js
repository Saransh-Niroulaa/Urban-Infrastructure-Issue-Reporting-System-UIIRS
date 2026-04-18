import express from 'express';
import { createIssue, getIssues, updateIssueStatus } from '../controllers/issueController.js';

const router = express.Router();

router.route('/')
  .post(createIssue)
  .get(getIssues);

router.route('/:id')
  .patch(updateIssueStatus);

export default router;
