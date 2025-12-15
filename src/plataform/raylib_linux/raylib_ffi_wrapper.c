#include "raylib.h"
#include <stdlib.h>

#ifdef __cplusplus
extern "C" {
#endif

Texture2D *LoadTexturePtr(const char *fileName) {
  Texture2D tex = LoadTexture(fileName);
  Texture2D *out = malloc(sizeof(Texture2D));
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
