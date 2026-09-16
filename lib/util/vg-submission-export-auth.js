// Preserve upstream export access for ordinary project roles while denying it
// to the VG Data Manager unless that actor also has the explicit export verb.
const canExportSubmissionsOrReject = async (auth, form) => {
  if (await auth.can('submission.export', form)) return form;

  // vg_form_access.update identifies the narrow VG management role family.
  // Admins/managers already returned above because they have submission.export.
  if (await auth.can('vg_form_access.update', form))
    return auth.canOrReject('submission.export', form);

  return auth.canOrReject('submission.read', form);
};

module.exports = { canExportSubmissionsOrReject };
