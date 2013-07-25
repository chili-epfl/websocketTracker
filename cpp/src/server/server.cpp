#include <iostream>

#include <websocketpp/config/asio_no_tls.hpp>
#include <websocketpp/server.hpp>

using namespace std;
using websocketpp::lib::placeholders::_1;
using websocketpp::lib::placeholders::_2;
using websocketpp::lib::bind;

typedef websocketpp::server<websocketpp::config::asio> server;

void on_message(server *s, websocketpp::connection_hdl hdl, server::message_ptr msg) {
    // std::cout << msg->get_payload() << std::endl;
    try {
        s->send(hdl, msg->get_payload(), msg->get_opcode());
    } catch (const websocketpp::lib::error_code &e) {
        cout << "Echo failed because: " << e
            << "(" << e.message() << ")" << endl;
    }
}

int main() {
    server print_server;

    print_server.set_message_handler(bind(&on_message,&print_server,::_1,::_2));

    print_server.init_asio();
    print_server.listen(9002);
    print_server.start_accept();

    print_server.run();
}
