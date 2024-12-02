import express from 'express'
import { cardValidation } from '~/validations/cardValidation'
import { cardController } from '~/controllers/cardController'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { multerUploadMiddleware } from '~/middlewares/multerUploadMiddleware'

const Router = express.Router()

Router.route('/')
  .post(authMiddleware.isAuthorized, cardValidation.createNew, cardController.createNew)

Router.route('/:id')
  .put(
    authMiddleware.isAuthorized,
    multerUploadMiddleware.upload.single('cardCover'),
    cardValidation.update,
    cardController.update
  )
  .delete(authMiddleware.isAuthorized, cardValidation.deleteItem, cardController.deleteItem)

Router.route('/:id/create-checklist')
  .post(authMiddleware.isAuthorized, cardValidation.createChecklist, cardController.createChecklist)

Router.route('/:id/:checklistId/add-checklist-item')
  .post(authMiddleware.isAuthorized, cardValidation.addChecklistItem, cardController.addChecklistItem)

Router.route('/:id/:checklistId/delete-checklist')
  .delete(authMiddleware.isAuthorized, cardController.deleteChecklist)

Router.route('/:id/:checklistId/:checklistItemId/completed')
  .put(authMiddleware.isAuthorized, cardController.setChecklistItemCompleted)

Router.route('/:id/:checklistId/:checklistItemId/text')
  .put(authMiddleware.isAuthorized, cardController.setChecklistItemText)

Router.route('/:id/:checklistId/:checklistItemId/delete-checklist-item')
  .delete(authMiddleware.isAuthorized, cardController.deleteChecklistItem)

Router.route('/:id/attachment')
  .post(authMiddleware.isAuthorized, cardValidation.addAttachment, cardController.addAttachment)

Router.route('/:id/:attachmentId/update-name')
  .put(authMiddleware.isAuthorized, cardController.updateAttachmentName)
// .delete(authMiddleware.isAuthorized, cardController.deleteAttachment)

Router.route('/:id/:attachmentId/update-link')
  .put(authMiddleware.isAuthorized, cardController.updateAttachmentLink)

Router.route('/:id/:attachmentId/delete-attachment')
  .delete(authMiddleware.isAuthorized, cardController.removeAttachment)

export const cardRoute = Router
