const axios = require('axios');
const { CronJob } = require('cron');

// Define the notification schedule
const notificationSchedule = [
    {
        day: "Monday",
        notifications: [
            {
                time: "07:00:00",
                title: "Good Morning🌟",
                message: "Start Your Week On a Positive Mind!💫 Tune In For Our Motivational Morning Podcasts🎙️",
            },
            {
                time: "17:00:00",
                title: "More Than Podcasts!🤔",
                message: "Arasu FM App offers more than just podcasts—explore our engaging video content too!📺"
            },
            {
                time: "21:00:00",
                title: "How's Your Day😊",
                message: "Stay updated! Listen To The Latest Podcast Updates On Arasu FM 90.4MHz🎧",
            },
        ],
    },
    {
        day: "Tuesday",
        notifications: [
            {
                time: "10:00:00",
                title: "Good Morning!🌞",
                message: "It's Tuesday—Time To Take a Step Closer To Your Goals. Keep Going Strong!💼",
            },
            {
                time: "18:00:00",
                title: "More Than Podcasts!🤔",
                message: "Arasu FM App offers more than just podcasts—explore our engaging video content too!📺"
            },
            {
                time: "22:00:00",
                title: "Are you Feeling Low😔",
                message: "Just Listen To Some Motivational Podcasts🎙️.Which Make You Better😇",
            },
        ],
    },
    {
        day: "Wednesday",
        notifications: [
            {
                time: "09:00:00",
                title: "GM! Happy Wednesday🌸",
                message: "You're Halfway Through The Week! Keep Pushing Forward By Listening To Some Podcasts💪",
            },
            {
                time: "16:00:00",
                title: "More Than Podcasts!🤔",
                message: "Arasu FM App offers more than just podcasts—explore our engaging video content too!📺"
            },
            {
                time: "20:00:00",
                title: "How's Your Day😊",
                message: "Stay Updated! Listen To The Latest Podcast Updates On Arasu FM 90.4MHz🎧🌙",
            },
        ],
    },
    {
        day: "Thursday",
        notifications: [
            {
                time: "11:00:00",
                title: "Hello, Thursday!🌟",
                message: "Let's Make Today Productive And Full Of Good Vibes.😊",
            },
            {
                time: "14:00:00",
                title: "More Than Podcasts!🤔",
                message: "Arasu FM App offers more than just podcasts—explore our engaging video content too!📺"
            },
            {
                time: "18:00:00",
                title: "Are You Tired🥺",
                message: "Tired of the same routine? Shake things up and explore something new by listening to podcasts!📻",
            },
        ],
    },
    {
        day: "Friday",
        notifications: [
            {
                time: "08:00:00",
                title: "Good Morning!",
                message: "Time to wrap up the week and welcome the weekend with our Amazing Podcasts!🥳",
            },
            {
                time: "14:15:00",
                title: "More Than Podcasts!🤔",
                message: "Arasu FM App offers more than just podcasts—explore our engaging video content too!📺"
            },
            
            {
                time: "19:00:00",
                title: "Hey! it's Friday Evening😎",
                message: "Time to wrap up the week and welcome the weekend with our new podcasts!🥳",
            },
        ],
    },
    {
        day: "Saturday",
        notifications: [
            {
                time: "10:05:00",
                title: "Its Weekend Right",
                message: "Weekend vibes are here! Don't miss our morning show featuring inspiring stories from our community.🌈",
            },

            {
                time: "10:16:00",
                title: "Its Weekend Right",
                message: "Weekend vibes are here! Don't miss our morning show featuring inspiring stories from our community.🌈",
            },

            {
                time: "10:12:00",
                title: "Its Weekend Right",
                message: "Weekend vibes are here! Don't miss our morning show featuring inspiring stories from our community.🌈",
            },
            {
                time: "13:00:00",
                title: "Time for Lunch!",
                message: "Enjoy your meal and make it better with our engaging podcasts! 🎙️"
            },
            {
                time: "18:00:00",
                title: "More Than Podcasts!🤔",
                message: "Arasu FM App offers more than just podcasts—explore our engaging video content too!📺"
            },
        ],
    },
    {
        day: "Sunday",
        notifications: [
            {
                time: "08:00:00",
                title: "Soulful Sunday Morning🎼",
                message: "Good morning!🌞 Start your Sunday with Our Podcasts🎼",
            },
            {
                time: "14:00:00",
                title: "Heritage Hour🌍",
                message: "Let's celebrate culture!🌍 Join us for Heritage and explore local traditions.",
            },
            {
                time: "19:00:00",
                title: "Oh, Tomorrow is Monday!😲",
                message: "End your weekend with motivating podcasts and videos to kickstart your best Monday yet. 🚀"
            },
        ],
    }
];



// Modified function to send a notification
const sendNotification = async (title, message, time) => {
    try {
        const response = await axios.post(
            'https://onesignal.com/api/v1/notifications',
            {
                app_id: process.env.ONESIGNAL_APP_ID,
                headings: { en: title },
                contents: { en: message },
                priority: 'HIGH',
                included_segments: ['All'],
                send_after: time.toISOString(),
                is_local_time: true,
            },
            {
                headers: {
                    'Authorization': `Basic ${process.env.ONESIGNAL_REST_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        console.log('Notification Scheduled:', {
            title,
            message,
            scheduledTime: time.toISOString()
        });
        return response.data;
    } catch (error) {
        console.error('Error Scheduling Notification:', error.response ? error.response.data : error.message);
        throw error;
    }
};

// Main scheduler function
const scheduleNotifications = async () => {
    try {
        const today = new Date();
        const todayDay = today.toLocaleString('en-US', { weekday: 'long' });
        
        const todaySchedule = notificationSchedule.find(
            (schedule) => schedule.day === todayDay
        );

        if (todaySchedule) {
            console.log(`Scheduling notifications for ${todayDay}`);
            for (const notification of todaySchedule.notifications) {
                const [hours, minutes, seconds] = notification.time.split(":").map(Number);
                const scheduledTime = new Date();
                scheduledTime.setUTCHours(hours, minutes, seconds, 0);

                await sendNotification(
                    notification.title,
                    notification.message,
                    scheduledTime
                );
            }
            console.log(`Successfully scheduled all notifications for ${todayDay}`);
        } else {
            console.log('No notifications scheduled for today.');
        }
    } catch (error) {
        console.error('Error in scheduleNotifications:', error);
        process.exit(1); // Exit with error code for GitHub Actions
    }
};

// Run the scheduler
console.log('Starting notification scheduler...');
scheduleNotifications().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});
