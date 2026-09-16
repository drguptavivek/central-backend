// Submission exports are a privileged operation.  Keep this check separate
// from submission.read so read-only project roles cannot export data.
const canExportSubmissionsOrReject = async (auth, form) => auth.canOrReject('submission.export', form);

module.exports = { canExportSubmissionsOrReject };
