/* 
 * =============================================================================
 *
 * Produce messages to Confluent Cloud
 * Using the node-rdkafka client for Apache Kafka
 *
 * =============================================================================
 */


const Kafka = require('node-rdkafka');
const configCloud = require('./config');

const ERR_TOPIC_ALREADY_EXISTS = 36;

function ensureTopicExists(config, topic) {

  const adminClient = Kafka.AdminClient.create({
    'bootstrap.servers': config['bootstrap.servers'],
    'sasl.username': config['sasl.username'],
    'sasl.password': config['sasl.password'],
    'security.protocol': config['security.protocol'],
    'sasl.mechanisms': config['sasl.mechanisms']
  });

  return new Promise((resolve, reject) => {
    console.log(typeof (topic));
    adminClient.createTopic({
      topic: 'dehradun',
      num_partitions: 1,
      replication_factor: 3
    }, (err) => {
      if (!err) {
        console.log(`Created topic ${topic}`);
        return resolve();
      }

      if (err.code === ERR_TOPIC_ALREADY_EXISTS) {
        return resolve();
      }

      return reject(err);
    });
  });
}

function createProducer(config, onDeliveryReport) {
  const producer = new Kafka.Producer({
    'bootstrap.servers': config['bootstrap.servers'],
    'sasl.username': config['sasl.username'],
    'sasl.password': config['sasl.password'],
    'security.protocol': config['security.protocol'],
    'sasl.mechanisms': config['sasl.mechanisms'],
    'dr_msg_cb': true
  });

  return new Promise((resolve, reject) => {
    producer
      .on('ready', () => resolve(producer))
      .on('delivery-report', onDeliveryReport)
      .on('event.error', (err) => {
        console.warn('event.error', err);
        reject(err);
      });
    producer.connect();
    console.log('connected');
  });
}

async function produceExample() {
  const config = configCloud.requiredConfig;
  const topic = configCloud.topic;

  // if (config.usage) {
  //   return console.log(config.usage);
  // };

  await ensureTopicExists(config, topic);

  const producer = await createProducer(config, (err, report) => {
    if (err) {
      console.warn('Error producing', err)
    } else {
      const {
        topic,
        partition,
        value
      } = report;
      console.log(`Successfully produced record to topic "${topic}" partition ${partition} ${value}`);
    }
  });

  const value = "some data";
  producer.produce(topic, -1, Buffer.from('Awesome message'), Date.now());

  producer.flush(10000, () => {
    producer.disconnect();
  });
}

produceExample()
  .catch((err) => {
    console.error(`Something went wrong:\n${err}`);
    process.exit(1);
  });