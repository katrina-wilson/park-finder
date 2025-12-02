import snakeCaseKeys from 'snakecase-keys';

export const reformatObjectToSnakeCase = (data) => snakeCaseKeys(data, { deep: true, exclude: [/_$/] });