const ATTACK_VALUE = 10;
const MONSTER_ATTACK_VALUE = 14;
const STRONG_ATTACK_VALUE = 18;
const HEAL_VALUE = 15;
// let choosenMaxLife = 100;
const MODE_ATTACK = 'Attack';
const MODE_STRONG_ATTACK = 'Strong_Attack';
const LOG_EVENT_PLAYER_ATTACK = 'Player_Attack';
const LOG_EVENT_PLAYER_STRONG_ATTACK = 'Player_Strong_Attack';
const LOG_EVENT_MONSTER_ATTACK = 'Monster_Attack';
const LOG_EVENT_PLAYER_HEAL = 'Player_Heal';
const LOG_EVENT_GAME_OVER = 'Game_Over';

const enteredValue = prompt("Maximum life for you and the monster ,", "100");
let choosenMaxLife = parseInt(enteredValue);
let battleLog = [];
if (isNaN(choosenMaxLife) || choosenMaxLife <= 0) {
  alert('cannot set 0 or below set 100 default');
  choosenMaxLife = 100;
}
let currentMonsterHealth = choosenMaxLife;
let currentPlayerHealth = choosenMaxLife;
let hasBonus = true;
adjustHealthBars(choosenMaxLife);
function writeToLog(ev,val,monsterHealth,playerHealth) {
  let logEntry = {
    Event : ev,
    Value : val,
    'Now Monster Health' : monsterHealth,
    'Now player Health' : playerHealth
  };
  switch (ev) {
    case LOG_EVENT_PLAYER_ATTACK:
      logEntry.Target = 'Monster';  
      break;
      case LOG_EVENT_PLAYER_STRONG_ATTACK:
        logEntry.Target = 'Monster';  
      break;
      case LOG_EVENT_MONSTER_ATTACK:
        logEntry.Target = 'Player';  
      break;
      case LOG_EVENT_PLAYER_HEAL:
        logEntry.Target = 'Player'; 
      break;
      case LOG_EVENT_GAME_OVER:
        // logEntry.target = 'Game End'; 
      break;
    default:
      logEntry = {};
      break;
  }
  battleLog.push(logEntry);
}

function reset() {
  currentPlayerHealth = choosenMaxLife;
  currentMonsterHealth = choosenMaxLife;
  resetGame(choosenMaxLife);
}
function endRound() {
  let initialPlayerHealth = currentPlayerHealth;
  const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
  currentPlayerHealth -= playerDamage;
  writeToLog(LOG_EVENT_MONSTER_ATTACK,playerDamage,currentMonsterHealth,currentPlayerHealth);
  if (currentPlayerHealth <= 0 && hasBonus) {
    hasBonus = false;
    removeBonusLife();
    currentPlayerHealth = initialPlayerHealth;
    setPlayerHealth(initialPlayerHealth);
    alert("You would be dead but bonus life saved you!");
  }
  if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
    alert("You Win !");
    writeToLog(LOG_EVENT_GAME_OVER,'player Win',currentMonsterHealth,currentPlayerHealth);
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
    alert("You Lose !");
        writeToLog(LOG_EVENT_GAME_OVER,'Monster Win',currentMonsterHealth,currentPlayerHealth);
  } else if (currentMonsterHealth <= 0 && currentPlayerHealth <= 0) {
    alert("Match Draw !");
    writeToLog(LOG_EVENT_GAME_OVER,'Draw',currentMonsterHealth,currentPlayerHealth);
  }
  if (currentPlayerHealth <= 0 || currentMonsterHealth <= 0) {
    reset();
  }
}

function playerMonsterAttack(mode) {
  let maxDamage;
  let writeEntryEvent;
  if (mode === "Attack") {
    maxDamage = ATTACK_VALUE;
    writeEntryEvent = LOG_EVENT_PLAYER_ATTACK;
  } else if (mode === "Strong_Attack") {
    maxDamage = STRONG_ATTACK_VALUE;
    writeEntryEvent = LOG_EVENT_PLAYER_STRONG_ATTACK;
  }
  const monsterDamage = dealMonsterDamage(maxDamage);
  currentMonsterHealth -= monsterDamage;
  writeToLog(writeEntryEvent,maxDamage,currentMonsterHealth,currentPlayerHealth);
  endRound();
  
}

function attackHandler() {
  playerMonsterAttack("Attack");
}
function strongAttackHandler() {
  playerMonsterAttack("Strong_Attack");
}
function healHandler() {
  let healValue;
  if (currentPlayerHealth >= choosenMaxLife - HEAL_VALUE) {
    alert("You cannot heal above ur initial max health");
    healValue = choosenMaxLife - currentPlayerHealth;
  } else {
    healValue = HEAL_VALUE;
  }
  increasePlayerHealth(healValue);

  currentPlayerHealth += healValue;
  writeToLog(LOG_EVENT_PLAYER_HEAL,healValue,currentMonsterHealth,currentPlayerHealth);
  endRound();
}

function printLogHandler() {
  // console.log(battleLog);
  let i = 0;
  for (const logEntry of battleLog) {
    console.log(`Log Entry at Index #${i}`);
    for (const key in logEntry) {
      console.log(`${key} --> ${logEntry[key]}`);
    }
    i++;
  }
}
healBtn.addEventListener("click", healHandler);
attackBtn.addEventListener("click", attackHandler);
strongAttackBtn.addEventListener("click", strongAttackHandler);
logBtn.addEventListener('click',printLogHandler);