CREATE TABLE queuesuppliers (
  supplier TEXT NOT NULL PRIMARY KEY,
  description TEXT
);
INSERT INTO queuesuppliers VALUES('manifestation', 'When a manifestation that hasn''t been deleted triggers queue events for manifestation ids');
INSERT INTO queuesuppliers VALUES('manifestation_deleted', 'When a manifestation that has been deleted triggers queue events for manifestation ids');
INSERT INTO queuesuppliers VALUES('holding', 'When a holdings change triggers queue events for manifestation ids');
INSERT INTO queuesuppliers VALUES('firstlastholding', 'When a change in "has love holdings" triggers queue events for manifestation ids');
INSERT INTO queuesuppliers VALUES('resource', 'When a resource change triggers queue events for manifestation ids');
INSERT INTO queuesuppliers VALUES('work', 'When a manifestation triggers queue events for works');
INSERT INTO queuesuppliers VALUES('workfirstlastholding', 'When a change in "has live holdings" triggers queue events for works');

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

