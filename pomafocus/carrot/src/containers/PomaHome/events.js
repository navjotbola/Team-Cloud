export default [
    {
      taskId: 0,
      title: 'All Day Event very long title',
      allDay: true,
      start: new Date(2018, 3, 0),
      end: new Date(2018, 3, 1),
    },
    {
      taskId: 1,
      title: 'Long Event',
      start: new Date(2018, 3, 7),
      end: new Date(2018, 3, 10),
    },
  
    {
      taskId: 2,
      title: 'DTS STARTS',
      start: new Date(2018, 2, 13, 0, 0, 0),
      end: new Date(2018, 2, 20, 0, 0, 0),
    },
  
    {
      taskId: 3,
      title: 'DTS ENDS',
      start: new Date(2018, 10, 6, 0, 0, 0),
      end: new Date(2018, 10, 13, 0, 0, 0),
    },
  
    {
      taskId: 4,
      title: 'Some Event',
      start: new Date(2018, 3, 9, 0, 0, 0),
      end: new Date(2018, 3, 10, 0, 0, 0),
    },
    {
      taskId: 5,
      title: 'Conference',
      start: new Date(2018, 3, 11),
      end: new Date(2018, 3, 13),
      desc: 'Big conference for important people',
    },
    {
      taskId: 6,
      title: 'Meeting',
      start: new Date(2018, 3, 12, 10, 30, 0, 0),
      end: new Date(2018, 3, 12, 12, 30, 0, 0),
      desc: 'Pre-meeting meeting, to prepare for the meeting',
    },
    {
      taskId: 7,
      title: 'Lunch',
      start: new Date(2018, 3, 12, 12, 0, 0, 0),
      end: new Date(2018, 3, 12, 13, 0, 0, 0),
      desc: 'Power lunch',
    },
    {
      taskId: 8,
      title: 'Meeting',
      start: new Date(2018, 3, 12, 14, 0, 0, 0),
      end: new Date(2018, 3, 12, 15, 0, 0, 0),
    },
    {
      taskId: 9,
      title: 'Happy Hour',
      start: new Date(2018, 3, 12, 17, 0, 0, 0),
      end: new Date(2018, 3, 12, 17, 30, 0, 0),
      desc: 'Most important meal of the day',
    },
    {
      taskId: 10,
      title: 'Dinner',
      start: new Date(2018, 3, 12, 20, 0, 0, 0),
      end: new Date(2018, 3, 12, 21, 0, 0, 0),
    },
    {
      taskId: 11,
      title: 'Birthday Party',
      start: new Date(2018, 3, 13, 7, 0, 0),
      end: new Date(2018, 3, 13, 10, 30, 0),
    },
    {
      taskId: 12,
      title: 'Late Night Event',
      start: new Date(2018, 3, 17, 19, 30, 0),
      end: new Date(2018, 3, 18, 2, 0, 0),
    },
    {
      taskId: 12.5,
      title: 'Late Same Night Event',
      start: new Date(2018, 3, 17, 19, 30, 0),
      end: new Date(2018, 3, 17, 23, 30, 0),
    },
    {
      taskId: 13,
      title: 'Multi-day Event',
      start: new Date(2018, 3, 20, 19, 30, 0),
      end: new Date(2018, 3, 22, 2, 0, 0),
    },
    {
      taskId: 14,
      title: 'Today',
      start: new Date(new Date().setHours(new Date().getHours() - 3)),
      end: new Date(new Date().setHours(new Date().getHours() + 3)),
    },
  ]