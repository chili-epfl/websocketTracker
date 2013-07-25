cmake_minimum_required (VERSION 2.8)
project (server)

set(SOURCES ${SOURCES}
    server.cpp
)

set (LIBS ${LIBS}
    boost_system
    pthread
)

add_executable(server ${SOURCES})
target_link_libraries(server ${LIBS})
