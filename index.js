const io = require('socket.io')(process.env.PORT || 3000);

const arrUserInfo = [];
const stt = 0;
const firstCamId = '';
const firstCamTen = '';

io.on('connection', socket => {
    socket.on('NGUOI_DUNG_DANG_KY', user => {
        const isExist = arrUserInfo.some(e => e.ten === user.ten);
        socket.peerId = user.peerId;
        if (isExist) return socket.emit('DANG_KY_THAT_BAT');
       
        /*stt++;
        user.stt = stt;
        if (stt == 1) {
            firstCamId = user.peerId;
            firstCamTen = user.ten;
        }
        
        user.firstCamId = firstCamId;*/
        
        arrUserInfo.push(user);
        socket.emit('DANH_SACH_ONLINE', arrUserInfo);
        socket.broadcast.emit('CO_NGUOI_DUNG_MOI', user);
    });

    socket.on('disconnect', () => {
        const index = arrUserInfo.findIndex(user => user.peerId === socket.peerId);
        arrUserInfo.splice(index, 1);
        if (stt > 0) {
             stt--;
        }
      
        if (user.peerId == firstCamId) {
            stt = 0;
        }
        io.emit('AI_DO_NGAT_KET_NOI', socket.peerId);
    });
});
