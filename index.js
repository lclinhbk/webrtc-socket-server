const io = require('socket.io')(process.env.PORT || 3000);

const arrUserInfo = [];
var stt = 0;
var firstCamId = '';
var firstCamTen = '';
var fixStt = 0;

io.on('connection', socket => {
    socket.on('NGUOI_DUNG_DANG_KY', user => {
        const isExist = arrUserInfo.some(e => e.ten === user.ten);
        socket.peerId = user.peerId;
        if (isExist) return socket.emit('DANG_KY_THAT_BAT');
       
        stt++;
        console.log("stt connect:", stt);
        user.stt = stt;
        if (stt == 1) {
            firstCamId = user.peerId;
            firstCamTen = user.ten;
            //user.stt = stt;
            if (fixStt) {
                stt = fixStt;
                console.log("stt fixed", stt);
            }
        }
        
        
        user.firstCamId = firstCamId;
        
        arrUserInfo.push(user);
        socket.emit('DANH_SACH_ONLINE', arrUserInfo);
        socket.broadcast.emit('CO_NGUOI_DUNG_MOI', user);
    });

    socket.on('disconnect', () => {
        const index = arrUserInfo.findIndex(user => user.peerId === socket.peerId);
        arrUserInfo.splice(index, 1);
//         fixStt = 0;
        if (stt > 0) {
             stt--;
        }
        if (stt <= 0) {
            fixStt = 0;
            stt = 0;
        }
      
         if (socket.peerId == firstCamId) {
             fixStt = 0;
             if(!(stt == 0)) {
                 fixStt = stt + 1;
             }
             stt = 0;
             console.log("ERRORfshjfsdfhdjfdfd");
        }
        io.emit('AI_DO_NGAT_KET_NOI', socket.peerId);
    });
});
