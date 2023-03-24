const {
  STATE_PROPOSED_DB_REPORTS_KEY,
  STATE_FINALIZED_DB_REPORTS_KEY,
  STATE_DISMISSED_DB_REPORTS_KEY,
} = require('./state/constants')
const { curry, length } = require('ramda')
const { logger } = require('./get-logger')
const schemas = require('ptokens-schemas')
const { db, constants } = require('ptokens-utils')

const updateEventInDb = curry(
  (_table, _eventReport) =>
    new Promise(resolve => {
      const id = _eventReport[schemas.constants.SCHEMA_ID_KEY]
      // Should update just the new fields
      const update = { $set: _eventReport }
      logger.debug(`Updating report ${id}`)

      return db.updateReportById(_table, update, id).then(resolve)
    })
)

const updateEventsInDb = (_table, _events) =>
  logger.info('Updating events into database...') ||
  Promise.all(_events.map(updateEventInDb(_table))).then(
    _ => logger.info(`Updated ${length(_events)} events!`) || Promise.resolve()
  )

const maybeUpdateEventsInDb = curry(
  (_eventsStateKey, _state) =>
    new Promise(resolve => {
      const eventsTable = _state[constants.STATE_KEY_DB]
      const events = _state[_eventsStateKey] || []
      const eventsLength = length(events)

      return eventsLength === 0
        ? logger.info('No proposals in state, skipping db update...') ||
            resolve(_state)
        : updateEventsInDb(eventsTable, events).then(_ => resolve(_state))
    })
)

const maybeUpdateProposedEventsInDb = maybeUpdateEventsInDb(
  STATE_PROPOSED_DB_REPORTS_KEY
)

const maybeUpdateFinalizedEventsInDb = maybeUpdateEventsInDb(
  STATE_FINALIZED_DB_REPORTS_KEY
)

const maybeUpdateDismissedEventsInDb = maybeUpdateEventsInDb(
  STATE_DISMISSED_DB_REPORTS_KEY
)

module.exports = {
  maybeUpdateProposedEventsInDb,
  maybeUpdateFinalizedEventsInDb,
  maybeUpdateDismissedEventsInDb,
}
