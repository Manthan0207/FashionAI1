import { motion } from 'framer-motion'
import { X } from 'lucide-react';
const NotificationModal = ({ notifications, onClose, onMarkAsRead }) => {
    // Sort notifications by date (newest first)
    const sortedNotifications = [...notifications].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] flex flex-col"
            >
                {/* Header */}
                <div className="border-b border-slate-200 p-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-800">Notifications</h2>
                        <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full">
                            <X size={20} className="text-slate-600" />
                        </button>
                    </div>
                </div>

                {/* Notification List */}
                <div className="flex-1 overflow-y-auto">
                    {sortedNotifications.length === 0 ? (
                        <div className="text-center py-8 text-slate-500">
                            No notifications
                        </div>
                    ) : (
                        sortedNotifications.map((notification) => (
                            <div
                                key={notification.createdAt}
                                className={`p-4 border-b border-slate-100 ${!notification.isRead ? 'bg-blue-50' : ''}`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className={`w-2 h-2 mt-2 rounded-full ${!notification.isRead ? 'bg-blue-500' : 'bg-transparent'}`} />
                                    <div className="flex-1">
                                        <p className="font-medium text-slate-800">{notification.message}</p>
                                        <div className="flex justify-between items-center mt-2">
                                            <span className="text-xs text-slate-500">
                                                {new Date(notification.createdAt).toLocaleString()}
                                            </span>
                                            {!notification.isRead && (
                                                <button
                                                    onClick={() => onMarkAsRead(notification)}
                                                    className="text-xs text-indigo-600 hover:text-indigo-800"
                                                >
                                                    Mark as read
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-slate-200 p-4 flex justify-end">
                    <button
                        onClick={() => {
                            // Mark all as read logic
                            notifications.forEach(n => {
                                if (!n.isRead) onMarkAsRead(n);
                            });
                        }}
                        className="text-sm text-indigo-600 hover:text-indigo-800 px-4 py-2"
                    >
                        Mark all as read
                    </button>
                </div>
            </motion.div>
        </div>
    );
};
export default NotificationModal