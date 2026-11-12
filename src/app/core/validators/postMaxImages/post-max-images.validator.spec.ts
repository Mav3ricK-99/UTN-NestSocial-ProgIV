import { FormControl, FormGroup } from '@angular/forms';
import { postMaxImages } from './post-max-images.validator';

describe('postMaxImages', () => {
  const form = (content: string) => new FormGroup({ content: new FormControl(content) });

  it('devuelve error si hay más imágenes que el máximo', () => {
    expect(postMaxImages(1)(form('<img src="a"><img src="b">'))).toEqual({ postMaxImages: { exceeded: true } });
  });

  it('devuelve null si no supera el máximo', () => {
    expect(postMaxImages(1)(form('<img src="a">'))).toBeNull();
  });
});
