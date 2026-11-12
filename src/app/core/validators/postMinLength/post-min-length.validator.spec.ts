import { FormControl, FormGroup } from '@angular/forms';
import { postMinLength } from './post-min-length.validator';

describe('postMinLength', () => {
  const form = (content: string) => new FormGroup({ content: new FormControl(content) });

  it('devuelve error si el texto (sin HTML) es más corto que el mínimo', () => {
    expect(postMinLength(3)(form('<p>ab</p>'))).toEqual({ postMinLength: { current: 2, min: 3 } });
  });

  it('devuelve null si alcanza el mínimo', () => {
    expect(postMinLength(3)(form('<p>abc</p>'))).toBeNull();
  });
});
