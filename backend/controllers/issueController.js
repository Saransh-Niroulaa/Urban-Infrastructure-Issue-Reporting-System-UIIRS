import Issue from '../models/Issue.js';

// @desc    Create an issue
// @route   POST /api/issues
// @access  Private
const createIssue = async (req, res, next) => {
  try {
    const { title, category, description, severity, location, zone, image } = req.body;
    
    // Construct issue
    const issue = new Issue({
      title,
      category,
      description,
      severity,
      location,
      zone,
      image,
      reporterId: null, // No auth needed
    });

    const createdIssue = await issue.save();
    res.status(201).json(createdIssue);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all issues
// @route   GET /api/issues
// @access  Private
const getIssues = async (req, res, next) => {
  try {
    // If not admin, maybe we could let citizens view all issues anyway for the map
    // The requirement says: "Citizen side: View all reported issues on a map"
    const issues = await Issue.find({}).populate('reporterId', 'name');
    res.json(issues);
  } catch (error) {
    next(error);
  }
};

// @desc    Update issue status
// @route   PATCH /api/issues/:id
// @access  Private/Admin
const updateIssueStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    const issue = await Issue.findById(req.params.id);

    if (issue) {
      issue.status = status;
      const updatedIssue = await issue.save();
      res.json(updatedIssue);
    } else {
      res.status(404);
      throw new Error('Issue not found');
    }
  } catch (error) {
    next(error);
  }
};

export { createIssue, getIssues, updateIssueStatus };
