#include "raylib.h"
#include <stdint.h>
#include <stdlib.h>

#ifdef __cplusplus
extern "C" {
#endif

static inline Color ColorFromARGB(uint32_t argb) {
  Color c;
  c.a = (argb >> 24) & 0xFF;
  c.r = (argb >> 16) & 0xFF;
  c.g = (argb >> 8) & 0xFF;
  c.b = (argb >> 0) & 0xFF;
  return c;
}

void ClearBackgroundU32(uint32_t argb) { ClearBackground(ColorFromARGB(argb)); }

void DrawTextU32(const char *text, int posX, int posY, int fontSize,
                 uint32_t argb) {
  DrawText(text, posX, posY, fontSize, ColorFromARGB(argb));
}

void DrawTexturePtrU32(const Texture2D *texture, int posX, int posY,
                       uint32_t argb) {
  if (!texture)
    return;
  DrawTexture(*texture, posX, posY, ColorFromARGB(argb));
}

void DrawTextureExPtrU32(const Texture2D *texture, int posX, int posY,
                         float escala, float rotacao, uint32_t argb) {
  if (!texture)
    return;
  DrawTextureEx(*texture, (Vector2){posX, posY}, rotacao, escala,
                ColorFromARGB(argb));
}

Texture2D *LoadTexturePtr(const char *fileName) {
  Image img = LoadImage(fileName);
  ImageColorInvert(&img);
  Texture2D tex = LoadTextureFromImage(img);
  Texture2D *out = malloc(sizeof(Texture2D));
  UnloadImage(img);
  if (!out)
    return NULL;
  *out = tex;
  return out;
}

void DrawTexturePtr(const Texture2D *texture, int posX, int posY, Color tint) {
  if (!texture)
    return;
  DrawTexture(*texture, posX, posY, tint);
}

void UnloadTexturePtr(Texture2D *texture) {
  if (!texture)
    return;
  UnloadTexture(*texture);
  free(texture);
}

void DrawTextureExPtr(const Texture2D *texture, int posX, int posY,
                      float escala, float rotacao, Color tint) {
  if (!texture)
    return;
  DrawTextureEx(*texture, (Vector2){posX, posY}, rotacao, escala, tint);
}

int TextureGetWidth(const Texture2D *t) {
  if (!t)
    return 0;
  return t->width;
}

int TextureGetHeight(const Texture2D *t) {
  if (!t)
    return 0;
  return t->height;
}

#ifdef __cplusplus
}
#endif
