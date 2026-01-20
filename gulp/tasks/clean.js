import del from 'del';

export const clean = () => {
  return del(app.paths.build);
};
