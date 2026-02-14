import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, getMonth, getYear } from 'date-fns'
import './CalendarModal.css'

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

function CalendarModal({ moments }) {
  const [selectedDate, setSelectedDate] = useState(new Date('2026-01-11'))
  const [selectedMoment, setSelectedMoment] = useState(null)

  const monthStart = startOfMonth(selectedDate)
  const monthEnd = endOfMonth(selectedDate)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const startPadding = monthStart.getDay()
  const paddingDays = Array(startPadding).fill(null)

  const momentsByDate = moments.reduce((acc, moment) => {
    const date = new Date(moment.date)
    const key = format(date, 'yyyy-MM-dd')
    acc[key] = moment
    return acc
  }, {})

  const handleDateClick = (day) => {
    setSelectedDate(day)
    const key = format(day, 'yyyy-MM-dd')
    if (momentsByDate[key]) {
      setSelectedMoment(momentsByDate[key])
    } else {
      setSelectedMoment(null)
    }
  }

  const changeMonth = (delta) => {
    const newDate = new Date(selectedDate)
    newDate.setMonth(newDate.getMonth() + delta)
    setSelectedDate(newDate)
    setSelectedMoment(null)
  }

  return (
    <motion.div
      className="calendar-modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="calendar-title">Our Journey</h2>

      <div className="calendar-container">
        <div className="calendar-header">
          <button className="calendar-nav" onClick={() => changeMonth(-1)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <h3 className="calendar-month-year">
            {MONTHS[getMonth(selectedDate)]} {getYear(selectedDate)}
          </h3>

          <button className="calendar-nav" onClick={() => changeMonth(1)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        <div className="calendar-grid">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="calendar-weekday">{day}</div>
          ))}

          {paddingDays.map((_, i) => (
            <div key={`pad-${i}`} className="calendar-day empty" />
          ))}

          {daysInMonth.map((day, i) => {
            const key = format(day, 'yyyy-MM-dd')
            const moment = momentsByDate[key]
            const isSelected = isSameDay(day, selectedDate)

            return (
              <motion.button
                key={i}
                className={`calendar-day ${moment ? 'has-moment' : ''} ${moment?.mood === 'high' ? 'high' : ''} ${moment?.mood === 'low' ? 'low' : ''} ${isSelected ? 'selected' : ''}`}
                onClick={() => handleDateClick(day)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="day-number">{format(day, 'd')}</span>
                {moment && <span className="moment-indicator" />}
              </motion.button>
            )
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {selectedMoment && (
          <motion.div
            key={selectedMoment.id}
            className="moment-detail"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className={`moment-card ${selectedMoment.mood}`}>
              {selectedMoment.media && (
                <div className="moment-media">
                  <img src={selectedMoment.media} alt={selectedMoment.title} loading="lazy" />
                </div>
              )}

              <div className="moment-content">
                <span className="moment-date">{format(new Date(selectedMoment.date), 'MMMM d, yyyy')}</span>
                <h3 className="moment-title">{selectedMoment.title}</h3>
                <p className="moment-description">{selectedMoment.description}</p>

                {selectedMoment.apology && (
                  <div className="moment-apology">
                    {selectedMoment.apology}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!selectedMoment && (
        <div className="moment-placeholder">
          Select a date with a moment to view details
        </div>
      )}
    </motion.div>
  )
}

export default CalendarModal
