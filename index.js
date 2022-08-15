/*
 Farthest Feasible Point algorithm implementation.
 Filters data, highlighting trends and omitting insignificant data points.

 The algorithm works with two primary (alpha and omega) and four secondary (deltas) points to form a corridor.
 Alpha and omega initially point to the starting point.
 Alpha and omega's deltas are pairs of points, deferred from the main point upwards and downwards by deltaY.
 The line between the alpha deltas forms the left wall of the corridor.
 Doors lines are drawn from the lower and upper delta.
 The algorithm iterates the points, marking the current one as omega and checking that the corridor doors are still closing.
 At each step, the doors are adjusted so that all points between alpha and omega fall into the corridor.

 The last omega at which the corridor was closed is considered a farthest feasible point and is assigned a new alpha.
 The algorithm runs until the corridor reaches the last point.
*/
export default function ffp() {
  let getX = (value, index) => index;
  let getY = (value) => value;
  let getResult = ({ value }) => value;

  let maxDeltaY = 1;

  // Компенсируем погрешность вычислений при сравнениях.
  let epsilon = Math.pow(2, -32);

  // Функция принимает на вход массив точек.
  // Возвращает массив объектов.
  function ffp(points) {
    // Текущая самая дальняя точка.
    let farthestFeasible = 0;

    // Тангенсы дверей коридора, нижней и верхней.
    let corridorDoors;

    // Альфа, индекс левой точки.
    let alpha;

    // Константы для обращения к границам тренда.
    const LOWER = 0;
    const UPPER = 1;

    // Добавление текущей точки в массив результатов.
    function pushPoint() {
      // «Скрещиваем» вектора границ тренда, чтобы их значения заменились на следующей точке.
      corridorDoors = [Infinity, -Infinity];
      // Текущую подходящую точку назначаем альфой.
      alpha = farthestFeasible;
      // Добавляем текущую подходящую точку в массив.
      result.push({
        index: farthestFeasible,
        value: points[farthestFeasible],
      });
    }

    // Массив результатов.
    const result = [];

    // Длина исходного массива.
    const length = points.length;

    // Начинаем алгоритм с добавления первой точки.
    pushPoint();

    // Алгоритм завершается, когда последней подходящей названа последняя точка массива.
    while (farthestFeasible < length - 1) {
      // Омега — текущая точка.
      let omega = alpha;
      // Пока не упёрлись в последнюю точку...
      while (omega < length) {
        // Расчитаем интересующие параметры:
        // - расстояние по оси абсцисс;
        const deltaX = getX(points[omega], omega) - getX(points[alpha], alpha);
        // - расстояние по оси ординат;
        const deltaY = getY(points[omega], omega) - getY(points[alpha], alpha);

        if (isNaN(deltaX) || isNaN(deltaY)) {
          throw new Error(
            `FFP error, value is NaN, check indices ${alpha} and ${omega}`
          );
        }

        // - тангенс линии между точками;
        const tg = deltaY / deltaX;
        // - изменение тангенса для дельта-точек;
        const deltaYTg = maxDeltaY / deltaX;
        // - тангенсы дверей коридора alpha-omega, нижней и верхней, тангенс нижней больше;
        const doors = [tg + deltaYTg, tg - deltaYTg];

        // Если нижняя дверь «смотрит» ниже двери коридора — подвинем дверь коридора.
        if (doors[LOWER] < corridorDoors[LOWER] + epsilon) {
          corridorDoors[LOWER] = doors[LOWER];
        }
        // Аналогично для верхней двери.
        if (corridorDoors[UPPER] < doors[UPPER] + epsilon) {
          corridorDoors[UPPER] = doors[UPPER];
        }
        if (
          corridorDoors[UPPER] < tg + epsilon &&
          tg < corridorDoors[LOWER] + epsilon
        ) {
          // Если омега попадает в коридор при текущем положении дверей — считаем её последней подходящей.
          farthestFeasible = omega;
        } else if (corridorDoors[LOWER] < corridorDoors[UPPER] + epsilon) {
          // Если двери коридора не пересекаются — сохраняем последнюю подходящую точку.
          pushPoint();
          // Повторяем алгоритм, откатываясь к этой точке.
          omega = alpha;
        }
        // В конце шага назначаем омегой следующую точку.
        omega++;
      }
      // Добавляем в результат последнюю точку массива.
      pushPoint();
    }

    // Возвращаем результат.
    return result.map(getResult);
  }

  ffp.maxDeltaY = function (newMaxDelta) {
    if (!arguments.length) return maxDeltaY;
    maxDeltaY = newMaxDelta;
    return ffp;
  };

  ffp.epsilon = function (newEpsilon) {
    if (!arguments.length) return epsilon;
    epsilon = newEpsilon;
    return ffp;
  };

  ffp.y = function (newAccessor) {
    getY = newAccessor;
    return ffp;
  };

  ffp.x = function (newAccessor) {
    getX = newAccessor;
    return ffp;
  };

  ffp.result = function (newMapper) {
    getResult = newMapper;
    return ffp;
  };

  return ffp;
}
