-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "salt" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "persons" (
    "id" SERIAL NOT NULL,
    "firstname" TEXT NOT NULL,
    "middlename" TEXT,
    "lastname" TEXT NOT NULL,
    "dob" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "persons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contacts" (
    "id" SERIAL NOT NULL,
    "address1" TEXT,
    "address2" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zip" TEXT,
    "country" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "banks" (
    "id" SERIAL NOT NULL,
    "number" TEXT NOT NULL,
    "name" TEXT,
    "country" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "banks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cards" (
    "id" SERIAL NOT NULL,
    "number" TEXT NOT NULL,
    "type" TEXT,
    "expire_month" TEXT NOT NULL,
    "expire_year" TEXT NOT NULL,
    "cvc" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "browsers" (
    "id" SERIAL NOT NULL,
    "useragent" TEXT NOT NULL,
    "os" TEXT,
    "ip" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "browsers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "passwords" (
    "id" SERIAL NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "passwords_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "genders" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "genders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "phones" (
    "id" SERIAL NOT NULL,
    "number" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "phones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emails" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "emails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" SERIAL NOT NULL,
    "number" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "country" TEXT,
    "expire" TEXT,
    "blob" BYTEA,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserPersons" (
    "user_id" INTEGER NOT NULL,
    "person_id" INTEGER NOT NULL,
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "_UserPersons_pkey" PRIMARY KEY ("user_id","person_id")
);

-- CreateTable
CREATE TABLE "_PersonGenders" (
    "person_id" INTEGER NOT NULL,
    "gender_id" INTEGER NOT NULL,
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "_PersonGenders_pkey" PRIMARY KEY ("person_id","gender_id")
);

-- CreateTable
CREATE TABLE "_PersonPhones" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_PersonContacts" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ContactPhones" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ContactEmails" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_PersonBanks" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_PersonCards" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_PersonAccounts" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_PersonBrowsers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_PersonPasswords" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_PersonEmails" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_EmailPasswords" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_PersonDocuments" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "persons_firstname_middlename_lastname_dob_key" ON "persons"("firstname", "middlename", "lastname", "dob");

-- CreateIndex
CREATE UNIQUE INDEX "contacts_address1_address2_city_state_zip_country_key" ON "contacts"("address1", "address2", "city", "state", "zip", "country");

-- CreateIndex
CREATE UNIQUE INDEX "banks_number_name_country_key" ON "banks"("number", "name", "country");

-- CreateIndex
CREATE UNIQUE INDEX "cards_number_expire_month_expire_year_cvc_key" ON "cards"("number", "expire_month", "expire_year", "cvc");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_url_username_key" ON "accounts"("url", "username");

-- CreateIndex
CREATE UNIQUE INDEX "browsers_useragent_os_ip_key" ON "browsers"("useragent", "os", "ip");

-- CreateIndex
CREATE UNIQUE INDEX "passwords_password_key" ON "passwords"("password");

-- CreateIndex
CREATE UNIQUE INDEX "genders_type_key" ON "genders"("type");

-- CreateIndex
CREATE UNIQUE INDEX "phones_number_key" ON "phones"("number");

-- CreateIndex
CREATE UNIQUE INDEX "emails_address_key" ON "emails"("address");

-- CreateIndex
CREATE UNIQUE INDEX "documents_number_type_country_expire_blob_key" ON "documents"("number", "type", "country", "expire", "blob");

-- CreateIndex
CREATE UNIQUE INDEX "_UserPersons_user_id_key" ON "_UserPersons"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "_UserPersons_person_id_key" ON "_UserPersons"("person_id");

-- CreateIndex
CREATE UNIQUE INDEX "_UserPersons_user_id_person_id_key" ON "_UserPersons"("user_id", "person_id");

-- CreateIndex
CREATE UNIQUE INDEX "_PersonGenders_person_id_key" ON "_PersonGenders"("person_id");

-- CreateIndex
CREATE UNIQUE INDEX "_PersonGenders_gender_id_key" ON "_PersonGenders"("gender_id");

-- CreateIndex
CREATE UNIQUE INDEX "_PersonGenders_person_id_gender_id_key" ON "_PersonGenders"("person_id", "gender_id");

-- CreateIndex
CREATE UNIQUE INDEX "_PersonPhones_AB_unique" ON "_PersonPhones"("A", "B");

-- CreateIndex
CREATE INDEX "_PersonPhones_B_index" ON "_PersonPhones"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PersonContacts_AB_unique" ON "_PersonContacts"("A", "B");

-- CreateIndex
CREATE INDEX "_PersonContacts_B_index" ON "_PersonContacts"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ContactPhones_AB_unique" ON "_ContactPhones"("A", "B");

-- CreateIndex
CREATE INDEX "_ContactPhones_B_index" ON "_ContactPhones"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ContactEmails_AB_unique" ON "_ContactEmails"("A", "B");

-- CreateIndex
CREATE INDEX "_ContactEmails_B_index" ON "_ContactEmails"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PersonBanks_AB_unique" ON "_PersonBanks"("A", "B");

-- CreateIndex
CREATE INDEX "_PersonBanks_B_index" ON "_PersonBanks"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PersonCards_AB_unique" ON "_PersonCards"("A", "B");

-- CreateIndex
CREATE INDEX "_PersonCards_B_index" ON "_PersonCards"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PersonAccounts_AB_unique" ON "_PersonAccounts"("A", "B");

-- CreateIndex
CREATE INDEX "_PersonAccounts_B_index" ON "_PersonAccounts"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PersonBrowsers_AB_unique" ON "_PersonBrowsers"("A", "B");

-- CreateIndex
CREATE INDEX "_PersonBrowsers_B_index" ON "_PersonBrowsers"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PersonPasswords_AB_unique" ON "_PersonPasswords"("A", "B");

-- CreateIndex
CREATE INDEX "_PersonPasswords_B_index" ON "_PersonPasswords"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PersonEmails_AB_unique" ON "_PersonEmails"("A", "B");

-- CreateIndex
CREATE INDEX "_PersonEmails_B_index" ON "_PersonEmails"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_EmailPasswords_AB_unique" ON "_EmailPasswords"("A", "B");

-- CreateIndex
CREATE INDEX "_EmailPasswords_B_index" ON "_EmailPasswords"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PersonDocuments_AB_unique" ON "_PersonDocuments"("A", "B");

-- CreateIndex
CREATE INDEX "_PersonDocuments_B_index" ON "_PersonDocuments"("B");

-- AddForeignKey
ALTER TABLE "_UserPersons" ADD CONSTRAINT "_UserPersons_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserPersons" ADD CONSTRAINT "_UserPersons_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "persons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PersonGenders" ADD CONSTRAINT "_PersonGenders_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "persons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PersonGenders" ADD CONSTRAINT "_PersonGenders_gender_id_fkey" FOREIGN KEY ("gender_id") REFERENCES "genders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PersonPhones" ADD CONSTRAINT "_PersonPhones_A_fkey" FOREIGN KEY ("A") REFERENCES "persons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PersonPhones" ADD CONSTRAINT "_PersonPhones_B_fkey" FOREIGN KEY ("B") REFERENCES "phones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PersonContacts" ADD CONSTRAINT "_PersonContacts_A_fkey" FOREIGN KEY ("A") REFERENCES "contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PersonContacts" ADD CONSTRAINT "_PersonContacts_B_fkey" FOREIGN KEY ("B") REFERENCES "persons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContactPhones" ADD CONSTRAINT "_ContactPhones_A_fkey" FOREIGN KEY ("A") REFERENCES "contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContactPhones" ADD CONSTRAINT "_ContactPhones_B_fkey" FOREIGN KEY ("B") REFERENCES "phones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContactEmails" ADD CONSTRAINT "_ContactEmails_A_fkey" FOREIGN KEY ("A") REFERENCES "contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContactEmails" ADD CONSTRAINT "_ContactEmails_B_fkey" FOREIGN KEY ("B") REFERENCES "emails"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PersonBanks" ADD CONSTRAINT "_PersonBanks_A_fkey" FOREIGN KEY ("A") REFERENCES "banks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PersonBanks" ADD CONSTRAINT "_PersonBanks_B_fkey" FOREIGN KEY ("B") REFERENCES "persons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PersonCards" ADD CONSTRAINT "_PersonCards_A_fkey" FOREIGN KEY ("A") REFERENCES "cards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PersonCards" ADD CONSTRAINT "_PersonCards_B_fkey" FOREIGN KEY ("B") REFERENCES "persons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PersonAccounts" ADD CONSTRAINT "_PersonAccounts_A_fkey" FOREIGN KEY ("A") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PersonAccounts" ADD CONSTRAINT "_PersonAccounts_B_fkey" FOREIGN KEY ("B") REFERENCES "persons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PersonBrowsers" ADD CONSTRAINT "_PersonBrowsers_A_fkey" FOREIGN KEY ("A") REFERENCES "browsers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PersonBrowsers" ADD CONSTRAINT "_PersonBrowsers_B_fkey" FOREIGN KEY ("B") REFERENCES "persons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PersonPasswords" ADD CONSTRAINT "_PersonPasswords_A_fkey" FOREIGN KEY ("A") REFERENCES "passwords"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PersonPasswords" ADD CONSTRAINT "_PersonPasswords_B_fkey" FOREIGN KEY ("B") REFERENCES "persons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PersonEmails" ADD CONSTRAINT "_PersonEmails_A_fkey" FOREIGN KEY ("A") REFERENCES "emails"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PersonEmails" ADD CONSTRAINT "_PersonEmails_B_fkey" FOREIGN KEY ("B") REFERENCES "persons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EmailPasswords" ADD CONSTRAINT "_EmailPasswords_A_fkey" FOREIGN KEY ("A") REFERENCES "emails"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EmailPasswords" ADD CONSTRAINT "_EmailPasswords_B_fkey" FOREIGN KEY ("B") REFERENCES "passwords"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PersonDocuments" ADD CONSTRAINT "_PersonDocuments_A_fkey" FOREIGN KEY ("A") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PersonDocuments" ADD CONSTRAINT "_PersonDocuments_B_fkey" FOREIGN KEY ("B") REFERENCES "persons"("id") ON DELETE CASCADE ON UPDATE CASCADE;
