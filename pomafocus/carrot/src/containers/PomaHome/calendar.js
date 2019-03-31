import { API } from "aws-amplify";
import React, { Component } from "react";
import BigCalendar from 'react-big-calendar'
import moment from 'moment'
import events from './events';
import CalendarEventModal from '../../components/CalendarEventModal'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './calendar.css';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import { LUNCH_TYPE } from "../../constants";

// Setup the localizer by providing the moment (or globalize) Object
// to the correct localizer.
const localizer = BigCalendar.momentLocalizer(moment) // or globalizeLocalizer
const DragAndDropCalendar = withDragAndDrop(BigCalendar)

export default class Calendar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showEventModal: false,
            events: [],
            googleEvents: [],
        }
    }

    async componentDidMount() {
        this.fetchData()
    }

    fetchData = async () => {
        this.setState({ events: [] });
        const schedule = await this.getSchedule();
        console.log('schedule', schedule);
		console.log("Calling listUpcomingEvents");
        this.listUpcomingEvents();	  
        
        const now = moment().format('X');
        // Convert to dates
        if(schedule.Items.length) {
            schedule.Items.forEach(task => {
                const later = moment(task.start.slice(0, -1)).format('X');
                const millisTill = (later - now) * 1000;
                task.start = new Date(task.start.slice(0, -1))
                task.end = new Date(task.end.slice(0, -1))
                if (millisTill > 0) {
                    setTimeout(() => {
                        if (window.confirm(`Its time for your next task (${task.title})! Press ok to start, cancel to snooze.`)) {
                            this.setState({ showEventModal: true, event: task });
                        } else {
                            // snooze
                        };
                    }, millisTill);
                }
                return task
            });
        }
        this.setState({ events: schedule.Items });
    }

    listUpcomingEvents = () => {
        var startTime =new Date();
        var endTime = new Date()
        endTime.setDate(endTime.getDate() + 7);
    
        console.log("Enter listUpcomingEvents" + startTime.toISOString() + endTime.toISOString());
        
        window.gapi.client.load('calendar', 'v3', () => {
            window.gapi.client.calendar.events.list({
                'calendarId': 'primary',
                'timeMin': startTime.toISOString(),
                'timeMax': endTime.toISOString(),
                'showDeleted': false,
                'singleEvents': true,
                'maxResults': 10,
                'orderBy': 'startTime'
            }).then((response) => {
                var events = response.result.items;
                console.log('Upcoming events:' , events);
                if (events.length > 0) {
                    events.forEach((event) => {
                        console.log(event);
                        var startEvent = event.start.dateTime;
                        if (!startEvent) {
                            startEvent = event.start.date;
                        }
                        var endEvent = event.end.dateTime;
                        if (!endEvent) {
                            endEvent = event.end.date;
                        }
                        const oldList = this.state.events;
                        const newList = oldList.concat({
                            type: null,
                            end: new Date(endEvent),
                            start: new Date(startEvent),
                            title: event.summary,
                            type: null
                        });
                        this.setState({ events: newList });
                        console.log(event.summary + ' (' + startEvent + ')' + ' (' + endEvent + ')');
                    });
                } else {
                    console.log('No upcoming events found.');
                }
            });
        });
    }
    
    getSchedule = () => {
        return API.get("api", "/api/schedule", {
            queryStringParameters: {
                startDate: moment().startOf('isoWeek').format('YYYY-MM-DDTHH:mm:ss.SSS'),
                endDate: moment().add(1, 'weeks').endOf('isoWeek').format('YYYY-MM-DDTHH:mm:ss.SSS')
            },
        });
    };

    toggleEditModal = (event) => {
        const { type } = event;
        if(type === LUNCH_TYPE || type === null){
            return;
        }
        this.setState({ showEventModal: true, event });
    }

    handleEventModalHide = () => {
        this.setState({ showEventModal: false });
        this.fetchData();
        // window.location.reload();
    }


    moveEvent = ({ event, start, end, isAllDay: droppedOnAllDaySlot }) => {
        const { events } = this.state
    
        const idx = events.indexOf(event)
        let allDay = event.allDay
    
        if (!event.allDay && droppedOnAllDaySlot) {
          allDay = true
        } else if (event.allDay && !droppedOnAllDaySlot) {
          allDay = false
        }
    
        const updatedEvent = { ...event, start, end, allDay }
    
        const nextEvents = [...events]
        nextEvents.splice(idx, 1, updatedEvent)
    
        this.setState({
          events: nextEvents,
        })
    
        // alert(`${event.title} was dropped onto ${updatedEvent.start}`)
      }
    
      resizeEvent = ({ event, start, end }) => {
        const { events } = this.state
    
        const nextEvents = events.map(existingEvent => {
          return existingEvent.id === event.id
            ? { ...existingEvent, start, end }
            : existingEvent
        })
    
        this.setState({
          events: nextEvents,
        })
    
        //alert(`${event.title} was resized to ${start}-${end}`)
      }
    
      newEvent = (event) => {
        // let idList = this.state.events.map(a => a.id)
        // let newId = Math.max(...idList) + 1
        // let hour = {
        //   id: newId,
        //   title: 'New Event',
        //   allDay: event.slots.length === 1,
        //   start: event.start,
        //   end: event.end,
        // }
        // this.setState({
        //   events: this.state.events.concat([hour]),
        // })
    }
    
	render() {
        const { showEventModal, event } = this.state;
        const minTime = new Date();
        minTime.setHours(8,0,0);
        const maxTime = new Date();
        maxTime.setHours(20,0,0);
        console.log(minTime, maxTime);
		return (
            <div>
                <DragAndDropCalendar
                    selectable
                    localizer={localizer}
                    events={this.state.events}
                    onEventDrop={this.moveEvent}
                    resizable
                    onEventResize={this.resizeEvent}
                    onSelectSlot={this.newEvent}
                    defaultView={BigCalendar.Views.DAY}
                    startAccessor="start"
                    endAccessor="end"
                    className="animated fadeIn"
                    onSelectEvent={this.toggleEditModal}
                    min={minTime}
                    max={maxTime}
                />
				{
					showEventModal ? <CalendarEventModal show={showEventModal} handleClose={this.handleEventModalHide} event={event}/> : null
				}
             </div>
		);
	}
}