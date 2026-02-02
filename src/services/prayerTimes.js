export const getPrayerTimes = async (latitude, longitude) => {
     try {
          const date = new Date()
          // Method 13 is Diyanet
          const response = await fetch(
               `https://api.aladhan.com/v1/timings/${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}?latitude=${latitude}&longitude=${longitude}&method=13`
          )
          const data = await response.json()

          if (data.code === 200) {
               return {
                    timings: data.data.timings,
                    date: data.data.date,
                    hijri: data.data.date.hijri
               }
          }
          return null
     } catch (error) {
          console.error('Error fetching prayer times:', error)
          return null
     }
}

export const getCityName = async (latitude, longitude) => {
     try {
          const response = await fetch(
               `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          )
          const data = await response.json()
          const province = data.address.province || data.address.city || ''
          const district = data.address.town || data.address.district || data.address.suburb || ''

          if (province && district) {
               return `${district}, ${province}`
          }
          return province || district || 'Bilinmeyen Konum'
     } catch (error) {
          console.error('Error fetching city name:', error)
          return 'Konum Bulunamadı'
     }
}

export const calculateNextPrayer = (timings) => {
     if (!timings) return null;

     const now = new Date();
     const prayerOrder = [
          { key: 'Fajr', name: 'İmsak' },
          { key: 'Sunrise', name: 'Güneş' },
          { key: 'Dhuhr', name: 'Öğle' },
          { key: 'Asr', name: 'İkindi' },
          { key: 'Maghrib', name: 'Akşam' },
          { key: 'Isha', name: 'Yatsı' }
     ];

     for (let i = 0; i < prayerOrder.length; i++) {
          const prayer = prayerOrder[i];
          const [hours, minutes] = timings[prayer.key].split(':');
          const prayerTime = new Date();
          prayerTime.setHours(parseInt(hours), parseInt(minutes), 0);

          if (prayerTime > now) {
               return {
                    ...prayer,
                    time: timings[prayer.key],
                    targetDate: prayerTime
               };
          }
     }

     // If all times passed, next is Fajr of tomorrow
     const [fHours, fMinutes] = timings['Fajr'].split(':');
     const nextFajr = new Date();
     nextFajr.setDate(nextFajr.getDate() + 1);
     nextFajr.setHours(parseInt(fHours), parseInt(fMinutes), 0);

     return {
          key: 'Fajr',
          name: 'İmsak',
          time: timings['Fajr'],
          targetDate: nextFajr
     };
};
