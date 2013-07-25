cmake_minimum_required (VERSION 2.8)
project (tinkerweb)

if (NOT CMAKE_BUILD_TYPE)
  set(CMAKE_BUILD_TYPE Debug)
endif (NOT CMAKE_BUILD_TYPE)

set(BASE_DIR ${PROJECT_BINARY_DIR}) #/../build/${CMAKE_BUILD_TYPE})
set(CMAKE_LIBRARY_PATH ${BASE_DIR}/lib)
set(CMAKE_LIBRARY_OUTPUT_DIRECTORY ${CMAKE_LIBRARY_PATH})
set(CMAKE_ARCHIVE_OUTPUT_DIRECTORY ${CMAKE_LIBRARY_OUTPUT_DIRECTORY})
set(CMAKE_BINARY_DIR ${BASE_DIR})
set(EXECUTABLE_OUTPUT_PATH ${BASE_DIR}/bin)

set(CMAKE_DEBUG_POSTFIX "_d")

option(BUILD_SHARED_LIBS "Set to OFF to build static libraries" ON)

if (CMAKE_COMPILER_IS_GNUCXX)
  set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -Wall")
  set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -Werror")
  set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++0x")
  set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -D__GXX_EXPERIMENTAL_CXX0X__")
  if (ENABLE_PROFILING STREQUAL ON)
     set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -p")
  endif()
  if (CMAKE_BUILD_TYPE STREQUAL Debug)
    message("Build type: DEBUG")
  endif()
  if (CMAKE_BUILD_TYPE STREQUAL Release)
    message("Build type: RELEASE")
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -O3")
  endif()
endif(CMAKE_COMPILER_IS_GNUCXX)

add_definitions(-D__GXX_EXPERIMENTAL_CXX0X__)

include_directories("/usr/include" "/usr/local/include/websocketpp")

message("Binary dir: "${CMAKE_BINARY_DIR})
 
add_subdirectory(server)
