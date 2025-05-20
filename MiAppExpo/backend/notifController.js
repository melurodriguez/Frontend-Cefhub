import {notificaciones} from './db'

export const notifUserId = (id) => {
  return notificaciones.filter(notif => notif.userId === id);
};