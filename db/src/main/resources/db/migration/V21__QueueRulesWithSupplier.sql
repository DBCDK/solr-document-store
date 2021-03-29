CREATE TABLE queuesuppliers (
  supplier TEXT NOT NULL PRIMARY KEY
);
INSERT INTO queuesuppliers VALUES('manifestation');
INSERT INTO queuesuppliers VALUES('manifestation_deleted');
INSERT INTO queuesuppliers VALUES('holding');
INSERT INTO queuesuppliers VALUES('firstlastholding');
INSERT INTO queuesuppliers VALUES('resource');
INSERT INTO queuesuppliers VALUES('work');
INSERT INTO queuesuppliers VALUES('workfirstlastholding');

ALTER TABLE queuerule
  ADD COLUMN supplier TEXT NOT NULL DEFAULT 'manifestation';

ALTER TABLE queuerule
  ADD CONSTRAINT queuerule_supplier_fkey FOREIGN KEY (supplier) REFERENCES queuesuppliers (supplier);

ALTER TABLE queuerule
  ALTER COLUMN supplier DROP DEFAULT;

ALTER TABLE queuerule
  DROP CONSTRAINT queuerule_pkey;
ALTER TABLE queuerule
  ADD CONSTRAINT queuerule_pkey PRIMARY KEY (queue, supplier);

INSERT INTO queuerule(queue, supplier) SELECT queue, 'holding' FROM queuerule WHERE supplier = 'manifestation';
INSERT INTO queuerule(queue, supplier) SELECT queue, 'resource' FROM queuerule WHERE supplier = 'manifestation';
INSERT INTO queuerule(queue, supplier) SELECT queue, 'manifestation_deleted' FROM queuerule WHERE supplier = 'manifestation';

ALTER TABLE queuerule
  ADD COLUMN postpone INTEGER NOT NULL DEFAULT 0;

