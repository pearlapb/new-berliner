import axios from 'axios';
import * as io from 'socket.io-client';

let socket;

const getSocket = () => {
    if (socket) {
        return socket;
    } else {
        socket = io.connect();
        socket.on('connect', function() {
            axios.get(`/connected/${socket.id}`);
        });
        return socket;
    }
};

export default getSocket;
