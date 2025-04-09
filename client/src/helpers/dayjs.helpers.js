import dayjs from 'dayjs';
import 'dayjs/locale/fi';
import utc from 'dayjs/plugin/utc';

export const selectedLocale = 'fi';

export const dayjsSetup = () => {
    dayjs.extend(utc);
    dayjs.locale(selectedLocale);
};

export const dayjsFormatTimeStamp = (date) => {
    return `${dayjs(date).format('DD.MM.YYYY')} klo ${dayjs(date).format('HH:mm')}`;
};

export const dayjsFormatDate = (date) => {
    return dayjs(date).format('DD.MM.YYYY');
};
