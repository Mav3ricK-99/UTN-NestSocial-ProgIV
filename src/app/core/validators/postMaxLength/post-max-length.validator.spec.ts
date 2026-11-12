import { FormControl, FormGroup } from '@angular/forms';
import { postMaxLength } from './post-max-length.validator';

describe('postMaxLength', () => {
  const form = (content: string) => new FormGroup({ content: new FormControl(content) });

  it('devuelve error si el texto (sin HTML) supera el máximo', () => {
    expect(postMaxLength(3)(form('<p>abcd</p>'))).toEqual({ postMaxLength: { current: 4, Max: 3 } });
  });

  it('devuelve null si no supera el máximo', () => {
    expect(postMaxLength(3)(form('<p>abc</p>'))).toBeNull();
  });
});
