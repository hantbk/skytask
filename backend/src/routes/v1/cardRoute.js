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

Router.route('/:id/:checklistId')
  .post(authMiddleware.isAuthorized, cardValidation.addChecklistItem, cardController.addChecklistItem)
  .delete(authMiddleware.isAuthorized, cardController.deleteChecklist)

Router.route('/:id/:checklistId/:checklistItemId/completed')
  .put(authMiddleware.isAuthorized, cardController.setChecklistItemCompleted)

Router.route('/:id/:checklistId/:checklistItemId/text')
  .put(authMiddleware.isAuthorized, cardController.setChecklistItemText)

Router.route('/:id/:checklistId/:checklistItemId')
  .delete(authMiddleware.isAuthorized, cardController.deleteChecklistItem)

export const cardRoute = Router
